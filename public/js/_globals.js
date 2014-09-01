/*========================================================
 * Global App name-space
 *========================================================
 */
var APP = (function($, PARENT){
	
	/*========================================================
	 * Define app globals
	 *========================================================
	 */
	var  _config = {
		url : 'http://'+window.location.hostname+':8080/' // local
		//url : 'http://'+window.location.hostname+'/' // public
	};
	
	/*========================================================
	 * free function arguments for garbage collection
	 *========================================================
	 */
	var freeMem = function(args){
		for(var i=0; i<args.length; i=i+1){
			args[i] = null;
		}
		return args;
	};
	
	/*========================================================
	 * localize ajax calls
	 *========================================================
	 */
	var ajaxFunc = function(uri, method, data, data_type, cb){
		console.log('Ajax call====================================>>');
		console.log(uri);
		$.ajax({
			 url	  : uri
			,type	  : method
			,data	  : (data)?data:{}
			,dataType : data_type
		})
		.done(function(o){
			console.log('result================>');
			console.log(o);
			cb(o);
			freeMem(arguments);
		});
	};
	
	/*========================================================
	 * extend jquery with loading function
	 *========================================================
	 */
	$.fn.extend({
		loading: function(){
			return this.addClass('csspinner duo');
		},
		loaded: function(){
			return this.removeClass('csspinner duo');
		}
	});
	
	/*======================================================================
	 * time events module
	 *======================================================================
	 */
	var timer = (function(){
		var  timerVal = 0
			,timerType = '';
		return {
			 START : function (type) {
				timerVal = new Date().getTime();
				timerType = type;
			}
			,STOP : function () {
				var elapsedTime = new Date().getTime() - timerVal; 
				console.log(timerType);
				console.log(elapsedTime + ' milliseconds');
				this.RESET();
			}
			,RESET : function() {
				timerVal = 0;
				timerVal = '';
			}
		};
	}());
	
	/*======================================================================
	 * Assign methods to function
	 *======================================================================
	 */
	Function.prototype.method = function (name, func) {
		if (!this.prototype[name])
			this.prototype[name] = func;
		return this;
	};
	
	/*======================================================================
	 * deentitify
	 *======================================================================
	 */
	String.method('deentityify', function () {
		var entity = {
			"quot" : '"',
			"lt" : '<',
			"gt" : '>',
			"amp;rsquo" : '\'',
			"amp;amp;rsquo" : '\'',
			"amp;rdquo" : '"',
			"amp;amp;rdquo" : '"',
			"amp;lsquo" : '\'',
			"amp;amp;lsquo" : '\'',
			"amp;ldquo" : '"',
			"amp;amp;ldquo" : '"',
			"amp;pound" : '£'
		};
		return function () {
			return this.replace(/&([^&]+);/gm, function (a, b) {
				var r = entity[b];
				return typeof r === 'string' ? r : a;
			}).replace(/\\/gm, '');
		};
	}());
	
	String.method('reentityify', function(){
		
		var entity = {	 	 	 	 
			 '<' : "&lt;"
			,'>' : "&gt;"
			,'/' : "&#47;"
		};
		
		return function(){
			return this.replace(/([<|>|/])/gm, function(a,b){
				var r = entity[b];
				return typeof r === 'string'?r:a;
			});
		};
	}());
	
	/*======================================================================
	 * Add line breaks
	 *======================================================================
	 */
	String.method('addLineBreaks', function(){
		
		var entity = {	 	 	 
			 '\r\n' : "<br>"
			,'\r' : "<br>"
			,'\n' : "<br>"
		};
		
		return function(){
			return this.replace(/([\r\n|\r|\n])/gm, function(a,b){
				var r = entity[b];
				return typeof r === 'string'?r:a;
			});
		};
	}());
	
	/*========================================================
	 * Load individual shoe data in popup window
	 *========================================================
	 */
	var getUrl = function(){
		return _config.url;
	};
	
	/*======================================================================
	 * set order
	 *======================================================================
	 */
	var setVal = function(type, value){
		if(typeof type === 'object')
			config[type[0]][type[1]] = value;
		else
			config[type] = value;
		
		freeMem(arguments);
	};
	
	/*======================================================================
	 * get order
	 *======================================================================
	 */
	var getVal = function(type){
		if(typeof type === 'object')
			return config[type[0]][type[1]];
		else
			return config[type];
			
		freeMem(arguments);
	};
	
	/*======================================================================
	 * push val
	 *======================================================================
	 */
	var pushVal = function(type, value){
		config[type].push(value);
		
		freeMem(arguments);
	};
	
	/*======================================================================
	 * pop val
	 *======================================================================
	 */
	var popVal = function(type){
		config[type].pop();
		
		freeMem(arguments);
	};
	
	/*======================================================================
	 * remove array element
	 *=====================================================================
	 */
	var removeArrVal = function(type, val){
		var index = config[type].indexOf(val);
		config[type].splice(index, 1);
		
		freeMem(arguments);
	};
	
	/*======================================================================
	 * Check if is array or object
	 *======================================================================
	 */
	var checkIfIsArray = function(data){
		if(Object.prototype.toString.call(data) === '[object Array]')
			return true;
		else
			return false;
	};
	
	/*======================================================================
	 * Strip html
	 *======================================================================
	 */
	var addBreaks = function(string){
		return string.addLineBreaks();
	};
	
	/*======================================================================
	 * Optimized render
	 * @param: elem = string (element to create)
	 * @param: parent = string (element to populate)
	 * @param: data = array/object data array or object
	 *======================================================================
	 */
	var renderToDom = function(elem, parent, data){
	
		APP.prototype.TIMER.START('Render time: ');
		var fragment = document.createDocumentFragment();
		
		if(Object.prototype.toString.call(data) === '[object Array]');
			// is array
		else;
			// is object
		
		$.each(data, function(index, item){
			var div = document.createElement(elem);
			div.className = 'texDiv';
			div.appendChild(document.createTextNode(item));
			fragment.appendChild(div);
			//$('#'+parent).append(div);
		});

		$('#'+parent).append(fragment);
		APP.prototype.TIMER.STOP();
	};
	
	/*========================================================
	 * Load user data
	 *========================================================
	 */
	var getData = function(cb){
		
		//$('div').loading();
		
		var data = { 'id':'test' } || {};
		
		ajaxFunc(
			 APP.prototype.GET_URL()+'api/getData'
			,'GET'
			,data
			,'json'
			,function(o){
				cb(o);
				//$('div').loaded();
			}
		);
	};
	
	/*========================================================
	 * Build module for external use
	 *========================================================
	 */
	PARENT.prototype.TIMER			  = timer;
	PARENT.prototype.GET_URL		  = getUrl;
	PARENT.prototype.GET_DATA		  = getData;
	PARENT.prototype.SET_VAL		  = setVal;
	PARENT.prototype.GET_VAL		  = getVal;
	PARENT.prototype.PUSH_VAL		  = pushVal;
	PARENT.prototype.POP_VAL		  = popVal;
	PARENT.prototype.REMOVE_ARR_VAL   = removeArrVal;
	PARENT.prototype.IS_ARRAY		  = checkIfIsArray;
	PARENT.prototype.RENDER			  = renderToDom;
	PARENT.prototype.GET_DATA		  = getData;
	
	return PARENT;
	
}(jQuery, APP || function(){}));

/*======================================================================
 * start socket transactions
 *======================================================================
 */
var socket;

(function(APP){
	
	//socket = io.connect('ws://pubquizv2-nodebackbone.rhcloud.com:8000/'); // public
	socket = io.connect(APP.prototype.GET_URL()); // local

	/*======================================================================
	 * display latency
	 *======================================================================
	 */ 
	//var latencyTest = setInterval(function(){
	//	startTime = Date.now();
	//	socket.emit('ping');
	//}, 2000);
	
	socket.on('pong', function(){
		latency = Date.now() - startTime;
		console.log('Sever latency: '+latency+'ms');
	});
	
	socket.on('socket start', function(user){
	
		console.log('Hello socket...');
		
		/*
		(function(userScoreId){
			socket.on(userScoreId, function(data){
				$('.results').css({'display': 'block'});
				resultView = new ResultView();
				resultView.render(data);
			});
		}(userScoreId));*/
		
	});
	
	/*
	socket.on('update stats', function(data){
		console.log('Data received');
		weatherContentView = new WeatherContentView();
		weatherContentView.render(data);
	});*/
	
}(APP || function(){}));