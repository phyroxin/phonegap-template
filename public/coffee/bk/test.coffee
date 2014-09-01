###  Assignment ### # preserve comments
number = 42
greatlyImproved = happy = 'yes'
opposite = singing = knowsit = true
friday = true

### Conditions ###
number = -42 if opposite

### if, else, conditional ###
mood = greatlyImproved if singing

clapHands = (say) -> alert say
chaChaaaa = (dance) -> alert dance

if happy and knowsit
	clapHands('CLAP!! CLAP!!')
	chaChaaaa('Tango time!')
else
	showIt()

date = if friday then 'sue' else 'jill'

alert 'You have a date with ' + date

### Modules ###
APP = (($, PARENT)->
	config =
		test: 'value'
	add = (x, y) ->
		result = x + y
		result
	PARENT.prototype.ADD = add
	PARENT
)(jQuery, APP || ->)

### splats ###
gold = silver = rest = "unknown"

awardMedals = (first, second, others...) ->
	gold = first
	sivler = second
	rest = others

contenders = [
	"Michael Phelps"
	"Liu Xiang"
	"Yao Ming"
	"Allyson Felix"
	"Shawn Johnson"
	"Roman Sebrle"
	"Guo Jingjing"
]

awardMedals contenders...

alert "Gold: " + gold
alert "Silver: " + silver
alert "The Fields " + rest

### loops ###
eat = (foodItem) ->
	alert 'I\'m eating ' + foodItem
	
menu = (foodNum, foodChoice) ->
	alert foodChoice + ' is menu number ' + foodNum

eat food for food in ['toast','cheese','wine']

courses = ['greens','caviar','truffles','roast','cake']
menu i + i, dish for dish, i in courses

foods = ['broccoli','spinach','chocolate']
eat food for food in foods when food isnt 'chocolate'

### comprehensions ###
countdown = (num for num in [10..1])

yearsOld = max: 10, ida: 9, tim: 11

ages = for own child, age of yearsOld
	"#{child} is #{age}"

### existentials ###
solipsism = true if mind? and not world?
speed = 0
speed ?= 15
footprints = yeti ? "bear"

### classes ###
class Animal
	constructor: (@name) ->
	move: (meters, shock) ->
		alert @name + " moved #{meters}m #{shock}."
		
class Snake extends Animal
	move: ->
		alert "Slithering..."
		super 5, 'big wow!'
		
class Horse extends Animal
	move: ->
		alert "Galloping..."
		super 45, 'wow!'
		
sam = new Snake "Sammy the Python"
tom = new Horse "Tommy the Horse"

sam.move()
tom.move()

### backbone ###
class NewBackboneView extends Backbone.View
	el: '#appWeatherNow'
	initialize: ->
		alert 'init action'
		_.bindAll @inputFunc, 'buttonFunc'
		@render
		return
	
	inputFunc:
		button: '.buttonName'
		buttonFunc: ->
			alert 'button action'
			return

	render: ->
		alert 'hello backbone'
		@$el.html '<b>This is an input from coffee-scripted backbone!</b>'
		$(@inputFunc.button).on "click", _that: @inputFunc.button, @inputFunc.buttonFunc
		return
		#jade.render(
		#	el[0]
		#	'template'
		#		'header': 'Test Header'
		#)
		#return
		
window.NewBackboneView = NewBackboneView