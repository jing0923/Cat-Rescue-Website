var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Cat = require("./models/cat");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seed")

seedDB();
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");
app.use(flash());

//mongoose.connect("mongodb://localhost:27017/catpic_app", {useNewUrlParser: true});
mongoose.connect("mongodb+srv://jing:jing@catrescuewebsite-vala1.mongodb.net/test?retryWrites=true&w=majority",{
	useNewUrlParser: true,
	useCreateIndex: true
}).then(()=>{console.log("connect to mongodb");
			}).catch(err=>{console.log("Error:"), err.message});

//PASSPORT CONFIGURATION
app.use(require("express-session")({
		secret: "Good",
		resave: false,
		saveUninitialized: false
		}));
app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.get("/", function(req,res){
	res.render("landing");
});

app.get("/cat", function(req,res){
	Cat.find({}, function(err,cats){
	if(err){
		console.log("OH NO! Error:");
		console.log(err);
	}else{
		res.render("catCollection", {cats:cats, page:'cat'});
	}
});
});

app.post("/cat",isLoggedIn,function(req,res){
	//add new post to cats array
	var name = req.body.catname;
	var image = req.body.image;
	var description = req.body.description;
	var newCat = {name:name, image:image, description:description};
	Cat.create(newCat, function(err,cat){
	if(err){
		console.log(err);
	} else{
		console.log("A new cat has been added!");
		res.redirect("/cat");
	}
});
});

app.get("/cat/new", isLoggedIn,function(req,res){
	res.render("new");
});

app.get("/cat/:id", function(req,res){
	Cat.findById(req.params.id).populate("comments").exec(function(err, foundcat){
		if(err){
		console.log(err);
		next(err);
	} else{
			// console.log(foundcat);
			res.render("show", {cat:foundcat});
	}
	});
});

//==========comment route===========//
app.get("/cat/:id/comments/new",isLoggedIn, function(req,res){
	Cat.findById(req.params.id, function(err, foundcat){
		if(err){
			console.log(err);
		} else{
			res.render("comments/new",{cat:foundcat});
		}
	});
	
});

app.post("/cat/:id/comments", isLoggedIn, function(req,res){
	Cat.findById(req.params.id,function(err,foundcat){
		if(err){
			console.log(err);
			res.redirect("/cat");
		} else{
			Comment.create(req.body.comment, function(err,newcomment){
				if(err){
					console.log(err);
				} else{
					newcomment.author.id = req.user._id;
					newcomment.author.username = req.user.username;
					newcomment.save();
					foundcat.comments.push(newcomment);
					foundcat.save();
					res.redirect("/cat/" + foundcat._id);
				}
			});
		}
	});
	
});
//=========AUTH ROUTES========//
app.get("/register", function(req,res){
	res.render("register",{page:'register'});
});
app.post("/register", function(req,res){
	User.register(new User({username:req.body.username}), req.body.password, function(err,user){
		if(err){
			return res.render("register", {error:err.message});
		}
		passport.authenticate("local")(req, res, function(){
										req.flash("success", "Welcome to Purrfect Match!" + user.username);
									   res.redirect("/cat");
									   });
	});
});

app.get("/login", function(req,res){
	res.render("login", {page:'login'});
})

app.post("/login", passport.authenticate("local",{
	successRedirect: "/cat",
	failureRedirect: "/login"
	}), function(req,res){
	
});

app.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "You have successfully loged out");
	res.redirect("/");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "please Login first!");
	res.redirect("/login");
}

app.listen(9000, function(){
	console.log("The Purrfect Match Server Start!");
});