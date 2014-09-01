/*======================================================================
 * Todo:
 *======================================================================
 */

/*========================================================
 * Module dependencies
 *========================================================
 */
var  express  	    = require('express')
	,compression	= require('compression')
	,favicon	    = require('serve-favicon')
	,logger		    = require('morgan')
	,bodyParser	    = require('body-parser')
	,methodOverride = require('method-override')
	,cookieParser   = require('cookie-parser')
	,session        = require('express-session')
	,errorHandler   = require('errorhandler')
	,http	  	    = require('http')
	,stylus	  	    = require('stylus')
	,nib	  	    = require('nib')
	,path	  	    = require('path')
	,routes	  	    = require('./routes')
	,model	  	    = require('./models')
	//,socketModule   = require('./socket-module')
	,fs			    = require('fs')
	,app		    = express();

function compile(str, path){
	return stylus(str)
		.set('filename'. path)
		.use(nib());
}

/*========================================================
 * All environments
 *========================================================
 */
//app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1' ); // public
app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || '192.168.0.8'); // local work
//app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP || '192.168.0.7'); // local home
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine','jade');
//app.use(favicon());
app.use(compression());
app.use(logger({ format: 'dev', immediate: true }));
app.use(bodyParser());
app.use(methodOverride());
app.use(cookieParser('optional secret string')); // 'IwitnessedAGirraffePuke'
app.use(session({
	 secret : 'secret'
	,key	: 'express.sid'
}));

/*========================================================
 * Start server
 *========================================================
 */
var server = http.createServer(app).listen(app.get('port'), app.get('ipaddr'), function(){
	console.log('Express server listening on port '+ app.get('port'));
});

/*======================================================================
 * initialise socket IO
 *======================================================================
socketModule.init(server);
 */

/*======================================================================
 * initialise task test multithreading test
 *======================================================================
taskTest.init();
 */

/*======================================================================
 * Read file on upload request & place into uploads folder
 * Error: ENOSPC, write = tmp directory full
 *======================================================================
app.post('/api/upload', model.uploadFile)
 */

/*========================================================
 * Application routes
 *========================================================
 */
app.get('/', 			routes.index);
app.get('/home', 		routes.index);			    		    
app.get('/api/getData', model.getData);

/*======================================================================
 * Middleware now executes after routes
 *======================================================================
 */
app.use(stylus.middleware({
	 src	 : __dirname + '/public'
	,compile : compile
}));

app.use(express.static(path.join(__dirname + '/public')));
// development only
if ('development' == app.get('env')) {
	app.use(errorHandler());
}

