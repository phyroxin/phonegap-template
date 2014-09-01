/*===============================================================================================
 * Models
 *======================================================================
 */

// Comment Mode
var DefaultModel = Backbone.Model.extend({
	
	initialize: function() {
		this.on('change', function(){ /* commentView.render() */ });
	},
	defaults: {
		 "text": "Unknown Text"
		,"timestamp": "Unknown timestamp"
	}
});

/*===============================================================================================
 * Collections
 *======================================================================
 */

// Comment Collection
var DefaultCollection = Backbone.Collection.extend({
	
	model: DefaultModel,
	
	url: '/api/getData',
	
	initialize: function(){
		this.on('change', function(){ commentListView.render(); });
		console.log('running init function for ArtifactCollection');
		this.fetch({async:false});
	},
	
	parse: function(data) {
		console.log('running parse');
		return _.map(data, _.identity);
	},
	
	reset: function(models, options) {
		if(options && options.parse) {
			delete options.parse;
			models = this.parse(models);
		}
		return Backbone.Collection.prototype.reset.call(this, models, options);
	}
});

/*======================================================================
 * Workspace
 *======================================================================
 */
var Workspace = Backbone.Router.extend({
		
	routes:{
		 ""		 : "home"
		,"home"	 : "home"
		,"admin" : "admin"
	}
	
	,initialize: function(){}
	
	,home : function(){
		console.log('home');
		APP.prototype.GET_DATA(function(data){
			defaultView = new DefaultView();
			defaultView.render(data);
		});
	}
	
	,admin : function(){
		console.log('admin');
	}
});


/*===============================================================================================
 * Header View
 *======================================================================
 */
var DefaultView = Backbone.View.extend({

	 el: '#appContentWrap'
	 
	,initialize : function(){
		_.bindAll(this.inputFunc, 'onSignOut', 'onSignIn');
	}
	
	,inputFunc : {
		 value : 'value'
		,sgnBtn : '#sign-state'
		,onSignIn : function(e){
			e.preventDefault();
			console.log('sign in');
		}
		,onSignOut  : function(e){
			e.preventDefault();
			console.log('sign out');
		}
	}
	
	,render: function(obj){
		var el = this.$el;
		
		defaultHeaderView = new DefaultHeaderView();
		defaultHeaderView.render(obj);
		
		defaultContentView = new DefaultContentView();
		defaultContentView.render(obj);
		
		return this;
	}
});

/*======================================================================
 * Weather header View
 *======================================================================
 */
var DefaultHeaderView = Backbone.View.extend({

	 el: '#appHeader'
	 
	,initialize : function(){
		_.bindAll(this.inputFunc, 'onLocWeather');
	}
	
	,inputFunc : {
		 onLocBtn: '#area'
		,onLocWeather: function(){
			APP.prototype.GET_DATA(function(data){
				console.log(data);
			});
		}
	}
	
	,render: function(obj){
		
		var el = this.$el;
		
		jade.render(el[0]
			,'temp-header'
			,{
				'header': 'Test Header'
			}
		);
		
		$(this.inputFunc.onLocBtn).bind('keyup', { 'inputFunc': this.inputFunc }, function(event){
			if(event.keyCode === 13){
				console.log($(this).val());
				event.data.inputFunc.onLocWeather($(this).val());
			}
		});
		
		return this;
	}
});

/*======================================================================
 * Weather content View
 *======================================================================
 */
var DefaultContentView = Backbone.View.extend({

	 el: '#appContent'
	 
	,initialize : function(){}
	
	,inputFunc : {}
	
	,render: function(obj){
		var el = this.$el;
		
		jade.render(el[0]
			,'temp-content'
			,{
				'location': 'test'
			}
		);

		return this;
	}
});