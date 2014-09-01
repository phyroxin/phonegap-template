###===============================================================================================
 # Models
 #======================================================================
 ###

### Comment Mode ###
class DefaultModel extends Backbone.Model
	initialize: ->
		@on 'change', -> #defaultContentView.render()
	
	defaults:
		"text": "Unknown Text"
		"timestamp": "Unknown timestamp"

###===============================================================================================
 # Collections
 #======================================================================
 ###

### Comment Collection ###
class DefaultCollection extends Backbone.Collection
	
	model: DefaultModel
	
	url: '/api/getData'
	
	initialize: ->
		@on 'change', -> #commentListView.render()
		console.log 'running init function for ArtifactCollection'
		@fetch async: false
		return
	
	parse: (data) ->
		console.log 'running parse'
		_.map data, _.identity
	
	reset: (models, options) ->
		if options and options.parse
			delete options.parse models = @parse(models)
			Backbone.Collection.prototype.reset.call(this, models, options)
		return

###===============================================================================================
 # Workspace
 #======================================================================
 ###
class Workspace extends Backbone.Router
		
	routes:
		"": "home"
		"home": "home"
		"admin": "admin"
	
	initialize: ->
	
	home: ->
		console.log 'home'
		APP.prototype.GET_DATA((data)->
			defaultView = new DefaultView()
			defaultView.render(data)
			
			return)
			
		return
	
	admin: ->
		console.log 'admin'
		return

###===============================================================================================
 # Header View
 #======================================================================
 ###
class DefaultView extends Backbone.View

	el: '#appContentWrap'
	 
	initialize: ->
		_.bindAll @inputFunc, 'onSignOut', 'onSignIn'
	
	inputFunc:
		value: 'value'
		sgnBtn: '#sign-state'
		onSignIn: (e) ->
			e.preventDefault
			console.log 'sign in'
		
		onSignOut: (e) ->
			e.preventDefault
			console.log 'sign out'
	
	render: (obj) ->
		el = @$el
		
		defaultHeaderView = new DefaultHeaderView
		defaultHeaderView.render obj
		
		defaultContentView = new DefaultContentView
		defaultContentView.render obj
		
		return

###===============================================================================================
 # Weather header View
 #======================================================================
 ###
class DefaultHeaderView extends Backbone.View

	el: '#appHeader'
	 
	initialize: ->
		_.bindAll @inputFunc, 'onLocWeather'
	
	inputFunc:
		onLocBtn: '#area'
		onLocWeather: ->
			APP.prototype.GET_DATA (data) ->
				console.log data
	
	render: (obj) ->
		el = @$el
		jade.render el[0], 'temp-header', 'header': 'Test Header'
		$(@inputFunc.onLocBtn).bind 'keyup', 'inputFunc': this.inputFunc, (event) ->
			if event.keyCode is 13
				console.log $(@).val()
				event.data.inputFunc.onLocWeather $(@).val
			return
			
		return
		
###===============================================================================================
 # Weather content View
 #======================================================================
 ###
class DefaultContentView extends Backbone.View

	el: '#appContent'
	 
	initialize: ->
	
	inputFunc: {}
	
	render: (obj) ->
		el = @$el
		jade.render el[0], 'temp-content', 'location': 'test'
		
		newBackboneView = new NewBackboneView()
		newBackboneView.render()
		
		return
		
###===============================================================================================
 # Main text view
 #======================================================================
 ###
### backbone ###
class NewBackboneView extends Backbone.View
	
	el: '#appWeatherNow'
	
	initialize: ->
		_.bindAll @inputFunc, 'buttonFunc'
		return
	
	inputFunc:
		button: '.buttonName'
		buttonFunc: ->
			alert 'button action'
			return

	render: ->
		@$el.html '<b>This is an input from coffee-scripted backbone!</b>'
		
		$(@inputFunc.button).on "click", _that: @inputFunc.button, @inputFunc.buttonFunc
		
		return
