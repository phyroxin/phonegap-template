/*========================================================
 * Connect to DB
 *========================================================
 */
var  mongo 	= require('mongodb')
	,monk 	= require('monk')
	,G		= require('../globals')
	//,C	= require('./dbconn') // public
	//,db 	= monk(C.CONN.USR+':'+C.CONN.PWD+'@'+C.CONN.IP+':'+C.CONN.PORT+'/'+C.CONN.DBNAME) // public
	,db 	= monk('localhost:27017/phonegap-db') // local
	//,thread	= require('webworker-threads')
	,async 	= require('async')
	,fs		= require('fs')
	,csv	= require('csv-to-json');

/*========================================================
 * Check DB exists, if not create
 *========================================================
 */

var userColl = db.get('userdata');
	userColl.find({}
	,function(err, docs){
		if(err){
			console.log(err);
			return;
		}
		if(JSON.stringify(docs) !== '[]'){
			console.log('Connected to userdata database...');
		}
		else{
			console.log('Couldn\'t find userdata collection, creating with sample data...');
			populateUserDB(userColl, function(data){
				console.log(data);
			});
		}
	}
);

/*======================================================================
 * Data models
 *======================================================================
 */
exports.getData = function(req, res){
	
	var collection = db.get('userdata');
	collection.find({}
		,function(err, doc){
			if(err){
				console.log('No comments found');
				res.send('No results found');
			}
			else{
				console.log('Data sent');
				res.send(doc);
			}
		}
	);
};

exports.getUsers = function(req, res){
	
	var collection = db.get('userdata');
	collection.find({}
		,function(err, doc){
			if(err){
				console.log('No users found');
				res.send('No results found');
			}
			else{
				console.log('Data sent...');
				G.GLOBALS.prototype.USER_COUNT.prototype.SET(doc.length);
				res.send(doc);
			}
		}
	);
};

exports.getID = function(req, res){
	// Get our form values
	var  uid		= req.body.uid
		,collection = db.get('userdata');
	
	collection.findOne({sessionid:uid})
	.success(function(doc){
		if(doc!==null){
			console.log('Result found...');
			res.send({'data':doc});
		}
		else{
			console.log('No results found');
			res.send({'data':{'user':'null'}});
		}
	});
};

exports.addUser = function(req, res){
	// Get our form values
	var  data		= req.body
		,newData	= {}
		,collection = db.get('userdata');
	
	async.waterfall([
			 function(callback){
				for (var key in data)
					newData[key] = data[key];
				callback(null, newData);
			}
			,function(newData, callback){
				collection.insert(
					 newData 
					,function(err, doc){
						callback(err, doc);
					}
				);
			}
		]
		,function(err, result){
			if(err){
				// If it failed, return error
				res.send('There was a problem adding the user to the database.');
			}
			else{
				console.log('User inserted successfully!');
				// If it worked, forward to success page
				res.send({'data':result});
			}
		}
	);
};

exports.addData = function(req, res){

	var  data		= req.body
		,newData	= {}
		,collection = db.get('commentdata');	

	async.waterfall([
			 function(callback){
				for (var key in data)
					newData[key] = data[key];
				callback(null, newData);
			}
			,function(newData, callback){
				collection.insert(
					 newData 
					,function(err, doc){
						callback(err, doc);
					}
				);
			}
		]
		,function(err, result){
			if(err){
				// If it failed, return error
				res.send('There was a problem adding the comment to the database.');
			}
			else{
				console.log('Comment inserted successfully!');
				// If it worked, forward to success page
				res.send({'data':result});
			}
		}
	);
};

exports.addTidToUser = function(req, res){
	
	// Get our form values
	var  data		= req.body
		,newData 	= {}
		,usercoll	= db.get('userdata')
		,tablecoll	= db.get('tabledata')
		,markerCol 	= G.GLOBALS.prototype.GET_COLOUR();
	
	async.series([
			 function(callback){
				for (var key in data)
					newData[key] = data[key];
				callback(null, newData);
			 }
			,function(callback){
				usercoll.update(
					 { sessionid: data['uid'] }
					,{ $set: { 
						 tid: data['tid']
						,userColour: markerCol}
					}
				,function(err, doc){
					callback(err, doc);
				});
			}
			,function(callback){
				tablecoll.findAndModify({
					 query	: { table_id: data['tid'] }
					,update : { 
						 $inc  : { table_count: 1 }
						,$push : { 
							table_team: { 
								 userId : data['uid']
								,user	: data['u'] 
								,colour	: markerCol
							}
						}
					}
				}
				,function(err, doc){
					callback(err, doc);
				});
			}
			,function(callback){
				tablecoll.find({},{}, function(err, doc){
					G.GLOBALS.prototype.TABLE.prototype.UPDATE_TABLES(doc);
					callback(err, doc);
				});
			}
		]
		,function(err, results){
			if(err)
				res.send({'error':'with action!'});
			else
				res.send({'playerCol':markerCol});
		}
	);
};

exports.setTables = function(req, res){
	
	var data = req.body;
	// generate table objects
	G.GLOBALS.prototype.TABLE.prototype.GENERATE(data.tn, function(tables){	
		// Submit to the DB
		// Set our collection
		var collection = db.get('tabledata');	
		collection.drop();
		
		for(var index in tables) { 
		   if (tables.hasOwnProperty(index)) {
				collection.insert( tables[index] , function(err, doc){
					if(err){
						console.log('There was a problem creating the tables...!');
					}
					else{
						res.send({'data':tables});
					}
				});
		   }
		}
	});
}

exports.getTables = function(req, res){
	var collection = db.get('tabledata');
	collection.find({
			 $query	  : {}
			,$orderby : { _id : 1 }
		}
		,'-_id'
		,function(err, doc){ // exclude _id field
			if(err){
				console.log('There was a problem retrieving the tables...!');
			}
			else{
				console.log('Tables sent...');
				res.send({'data':doc});
			}
		}
	);
}


exports.clearTables = function(req, res){

	var tblcollection	= db.get('tabledata');
	var usercollection	= db.get('userdata');
	var messgcollection = db.get('commentdata');
	
	async.parallel([
			 function(callback){
				tblcollection.drop(function(err, doc){
					callback(err, doc);
				});
			}
			,function(callback){
				usercollection.drop(function(err, doc){
					callback(err, doc);
				});
			}
			,function(callback){
				messgcollection.drop(function(err, doc){
					callback(err, doc);
				});
			}
		]
		,function(err, results){
			if(err)
				res.send({'error':'with action!'});
			else
				res.send({'success':results});
		}
	);
}

exports.leaveTable = function(req, res){
	
	var data			= req.body;
	var usercollection	= db.get('userdata');
	var tblcollection	= db.get('tabledata');
	
	async.parallel([
			 function(callback){
				usercollection.findAndModify({
					 query	: { sessionid: data['uid'] }
					,update : { 
						$set: {
							tid: 'null'
						} 
					}
				}
				,function(err, doc){
					callback(err, doc);
				});
			}
			,function(callback){
				tblcollection.findAndModify({
					 query	: { table_id: data['tid'] }
					,update : { 
						 $inc  : { table_count: -1 }
						,$pull : { 
							table_team: { userId : data['uid'] }
						}
					}
				}
				,function(err, doc){
					callback(err, doc);
				});
			}
		]
		,function(err, results){
			if(err){
				res.send({'error':'with action!'});
			}
			else{
				console.log(results);
				res.send({'success':results});
			}
		}
	);	
}

exports.getSchedule = function(req, res){
	
	var schedulecollection	= db.get('scheduledata');

	schedulecollection.find({}
		,function(err, doc){
			if(err){
				console.log('There was a problem retreiving the schedules database.');
				res.send('error');
			}
			else{
				res.send(doc);
			}
		}
	);
}

exports.getAllQuiz = function(req, res){
	
	var quizcollection = db.get('quizdata');

	quizcollection.find({}
		,function(err, doc){
			if(err){
				console.log('There was a problem retreiving the quiz database.');
				res.send('error');
			}
			else{
				console.log('Quiz\'s collected...');
				console.log(doc);
				res.send(doc);
			}
		}
	);
}

exports.getAllQuestions = function(req, res){
	
	var questioncollection = db.get('questiondata');

	questioncollection.find({}
		,function(err, doc){
			if(err){
				console.log('There was a problem retreiving the question database.');
				res.send('error');
			}
			else{
				console.log('Questions collected...');
				res.send(doc);
			}
		}
	);
}

exports.getQuizCategory = function(req, res){
	
	var quizcatcollection	= db.get('categorydata');

	quizcatcollection.find({}
		,function(err, doc){
			if(err){
				console.log('There was a problem retreiving the category database.');
				res.send('error');
			}
			else{
				console.log(doc);
				res.send(doc);
			}
		}
	);
}

exports.insertQuizDetails = function(req, res){
	
	var  quizcollection	= db.get('quizdata')
		,data			= req.body
		,newData		= {};
	
	async.waterfall([
		 function(callback){
			for(var key in data){
				if(key === 'quiz_tags'){
					if(data[key].indexOf('|') !== -1){
						var tagArray = data[key].split('|');
						data[key] = tagArray;
					}
				}
				newData[key] = data[key];
			}
			callback(null, newData);
		}
		,function(newData, callback){
			quizcollection.insert( 
				 newData 
				,function(err, doc){
					callback(err, newData, doc);
				}
			);
		}]
		,function(err, newData, doc){
			if(err){
				console.log('There was a problem inserting the quiz details...!');
			}
			else{
				console.log(newData);
				res.send({ 'data entry': 'success', 'data': doc });
			}
		}
	);
}

exports.insertQuestionDetails = function(data,cb){
	
	var  questioncollection = db.get('questiondata')
		,num				= 0
		,questionObject		= {}
		,questionItem		= {};
	
	async.waterfall([
		 function(callback){
			for(var key in data){
				num = num +1;
				if(typeof data[key]['question'] !== 'undefined'){
					data[key]		  = G.GLOBALS.prototype.REMOVE_CHAR(data[key]);
					questionItem[num] = G.GLOBALS.prototype.CONVERT_OBJ(data[key]);
				}
			}
			questionObject = questionItem;
			callback(null, questionObject);
		}
		,function(newData, callback){
			questioncollection.insert( 
				 newData 
				,function(err, doc){
					callback(err, newData, doc);
				}
			);
		}]
		,function(err, questions, doc){
			if(err){
				console.log('There was a problem inserting the question details...!');
			}
			else{
				cb(doc);
			}
		}
	);
}

/*========================================================
 * add user score to database
 *========================================================
 */
exports.addUserScore = function(tid,uid,score,cb){
	var tablecoll = db.get('tabledata');
	async.series([
		 function(callback){
		 
			tablecoll.update(
				 { table_id: tid, "table_team.userId": uid }
				,{ $set : { "table_team.$.userScore" : score }}
			,function(err, doc){
				callback(err, doc);
			});
		}
		,function(callback){
			
			tablecoll.find({},{}, function(err, doc){
				G.GLOBALS.prototype.TABLE.prototype.UPDATE_TABLES(doc);
				callback(err, doc);
			});
		}]
		,function(err, results){
			if(err)
				console.log(err);
			else{
				console.log('User score added to database');
				cb();
			}
		}
	);
}

/*======================================================================
 * get question 
 * returns question object {}
 *======================================================================
 */

var getQuestions = function(){

	var questioncollection = db.get('questiondata');
	
	async.series([
			 function(callback){
				questioncollection.find({},{}, function(err, doc){
					callback(err, doc);
				});
			}
		]
		,function(err, doc){
			if(err){
				console.log('There was a problem collecting questions...!');
			}
			else{
				console.log('Questions collected...');
				console.log(doc);
				G.GLOBALS.prototype.QUIZ_MASTER.prototype.SET_QUESTION(doc, function(obj){
					G.GLOBALS.prototype.QUIZ_MASTER.prototype.COLLATE_ANSWERS(obj);
				});
			}
		}
	);
}

/*========================================================
 * File upload/csv read into database
 *========================================================
 */
var uploadFileFunction = function(obj, cb) {

	var  fileData = obj
		,uploadTime = 0
		,uploadTimer = setInterval(function(){									 // start stopclock in milliseconds
			 uploadTime = uploadTime +1;
		}, 1);
	
	var frState = fs.readFile(fileData.path, function (err, data) {				 // read file from temp directory
					 
		var tmp_path		 = fileData.path					 			 	 // temp directory path
		   ,newPath			 = G.GLOBALS.prototype.GET_PARENT_DIR(__dirname, '/')+"/uploads/"+fileData.name 			 			 // destination path
		   ,filename		 = fileData.name						 			 // get filename
		   ,extensionAllowed = ['.docx','.doc','.csv','.xls','.zip','.psd.zip']	 // allowed filetypes
		   ,maxSizeOfFile	 = 100000											 // maximum filesize allowed
		   ,i				 = filename.lastIndexOf('.')					 	 // find last occurrence of '.' in filename
		   ,file_extension	 = (i < 0) ? '' : filename.substr(i);				 // get filetype 

		if(err){
			cb({'state':'read error'});
		}
		else{
			if(file_extension === ''){
				cb({'state': 'filetype needed'});
			}
			else if((file_extension in G.GLOBALS.prototype.OC(extensionAllowed))&&((fileData.size /1024 )< maxSizeOfFile)){
				fs.writeFile(newPath, data, function (err) {					 // write file to 'uploads' directory
					if(err){
						fs.unlink(tmp_path, function(err) {						 // delete temp directory copy
							if (err) throw err;
							console.log('file deleted from temp directory after write error...');
						});
						clearInterval(uploadTimer);
						console.log('Upload time: '+uploadTime);
						cb({'state': 'write error'});
					}
					else{
						fs.unlink(tmp_path, function(err) {						 // delete temp directory copy
							if (err) throw err;
							console.log('file deleted from temp directory after write success...');
						});
						if(file_extension === '.csv'){						 	// if filetype is csv parse to json
							var json = csv.parse(newPath);
							G.GLOBALS.prototype.INSERT_CSV_DATA.prototype.INSERT(json, function(){
								clearInterval(uploadTimer);
								console.log('Upload time: '+uploadTime);
								console.log('File size: '+fileData.size/1024);							
							});
						}
						cb({'state': 'write success'});
					}
				});
			}
			else{
				fs.unlink(tmp_path, function(err) {								 // delete temp directory copy
					if (err) throw err;
					console.log('file deleted from temp directory after incorrect filetype...');
				});
				clearInterval(uploadTimer);
				console.log('Upload time: '+uploadTime);
				cb({'state': 'not the correct file type'});
			}
		}
	});
} 
 
 
exports.uploadFile = function(req, res){

	var file = req.files.uploadFile;

	uploadFileFunction(file, function(result){
		res.send(result);
	});

};
 
/*========================================================
 * Populate db with data if none found
 * @params coll = monk {}, data = {}, cb = callback function
 *========================================================
 */
var insertData = function(coll, data, cb){
	coll.insert(
		 data
		,function(err, result) {
			if(!err){
				console.log('...collection creation complete!');
				if(typeof cb !== 'undefined')
					cb(result);
			}
			else
				console.log('...database error!');
		}
	); 
};

var populateUserDB = function(coll) {
	
	var data = {};
	
	data['user'] = {
		 'usr':'lamin'
		,'pwd':'lamin1'
	}
	
	insertData(coll, data);
};

