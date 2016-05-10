var express = require("express")
var bodyParser = require("body-parser")
var path = require("path")
var mongoose = require("mongoose")

var app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, "./static")))
app.set("views", path.join(__dirname, "./views"))
app.set("view engine", "ejs")

mongoose.connect("mongodb://localhost/mongoose_dashboard")

var DogSchema = new mongoose.Schema({
	name: {type: String, required: true},
	birthday: {type: Date, required: true},
}) 

var Dog = mongoose.model("Dog", DogSchema)

app.get("/", function(req, res) {
	Dog.find({})
	.populate("dogs")
	.exec(function(err, dogs) {
	if(err) {
			console.log(err)
		}
		else {
			res.render("index", {dogs: dogs})
		}
	})
})

app.get("/mongooses/new", function(req, res) {
	res.render("new")
})

app.get("/mongooses/:id", function(req, res) {
	Dog.findOne({_id: req.params.id})
	.populate("dog")
	.exec(function(err, dog) {
		if(err) {
			console.log(err)
		}
		else {
			res.render("show", {dog: dog})
		}
	})
})


app.post("/mongooses", function(req, res) {
	console.log(req.body)
	var newDog = new Dog({name: req.body.name, birthday: req.body.birthday})
	newDog.save(function(err, newDog) {
		if(err) {
			console.log(err.message)
			res.redirect("/")
		}
		else {
			console.log("New dog " + req.body.name + " created.")
			res.redirect("/")
		}	
	})
}) 

app.get("/mongooses/:id/edit", function(req, res) {
	console.log(req.params)
	Dog.findOne({_id: req.params.id})
	.populate("dog")
	.exec(function(err, dog) {
		if(err) {
			console.log(err)
		}
		else {
			res.render("edit", {dog: dog})
		}
	})
})

app.post("/mongooses/:id/destroy", function(req, res) {
	console.log("Destroying record")
	Dog.remove({_id: req.params.id}, function(err) {
		if(err) {
			console.log(err)
		}
		else {
			res.redirect("/")
		}
	})
})

app.post("/mongooses/:id", function(req, res) {
	Dog.update({_id: req.params.id}, {name: req.body.name, birthday: req.body.birthday}, function(err) {
		if(err) {
			console.log(err)
		}
		else {
			res.redirect("/")
		}
	})
})

app.listen(8000, function() {
	console.log("listening on 8000")
})
