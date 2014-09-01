var  model	= require('../models');

/*======================================================================
 * server global name-space
 *======================================================================
 */
exports.GLOBALS = (function(){
	
	/*========================================================
	 * Define app globals
	 *========================================================
	 */
	var _config = {
		 'area':'brighton'
		,'competitionId':{
			'premier_league':'1204'
		}
	};
	
	var getAPILocation = function(){
		return _config.area;
	}
	
	var setAPILocation = function(loc){
		_config.area = loc;
	}
	
	var getCompetitionId = function(){
		return _config.competitionId.premier_league;
	}
	
	var setCompetitionId = function(key, value){
		return _config.competitionId[key] = value;
	}
	
	function GLOBALS(){};

	GLOBALS.prototype.GET_LOC  = getAPILocation;
	GLOBALS.prototype.SET_LOC  = setAPILocation;
	GLOBALS.prototype.GET_COMP = getCompetitionId;
	GLOBALS.prototype.SET_COMP = setCompetitionId;
	
	return GLOBALS;
}());