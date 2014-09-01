/*========================================================
 * Route Models
 *========================================================
 */
exports.index = function(req, res){
	console.log('Home page');
	res.render('index', {
		 title:'Phone Gap Exp. | Home'
		,headerText:'Phone Gap Exp. - Home'
	});
};

//exports.about = function(req, res){
//	console.log('About page');
//	res.render('about', {
//		 title:'Site Template | About'
//		,headerText:'Site Template - About'
//	});
//};
