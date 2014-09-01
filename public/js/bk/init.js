$(document).ready(function(){

	$(document)
		.on('click', '#id', function(){
			alert(1);
		});
	
	workspace = new Workspace();
	Backbone.history.start();
	setTimeout(function(){
		newBackboneView = new NewBackboneView();
		console.log(newBackboneView);
	}, 1*1000);
});