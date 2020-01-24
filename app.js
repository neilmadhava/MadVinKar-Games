//Setup

var express 				= require("express"),
	app 					= express(),
	mongoose 				= require("mongoose"),
	passport 				= require("passport"),
	bodyParser 				= require("body-parser"),
	User 					= require("./models/user"),
	LocalStrategy 			= require("passport-local"),
	passportLocalMongoose 	= require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/auth_demo_app", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
	secret: "I am a misanthrope.",
	resave: false,
	saveUninitialized: false
}));

app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//===========
// ROUTES    |
//===========

app.get("/", function(req, res){
	res.render("landing_page");
});

app.get("/secret", isLoggedIn, function(req, res){
	res.render("homepage");
});

// Games
// Colour Game
app.get("/colorgame", function(req, res){
	res.render("colorGame");
});

// Snake Game
app.get("/Snake", function(req, res){
	res.render("snake");
});

// Pong Game
app.get("/pong", function(req, res){
	res.render("pong");
});

// Breakout Game
app.get("/breakout", function(req, res){
	res.render("breakout");
});

//-----------------------
// Auth Routes
//Displaying SignUp form
app.get("/loginregister", function(req, res){
	res.render("login_register.ejs");
});

//Handling User SignUp
app.post("/register", function(req, res){
	req.body.username
	req.body.password
	User.register(new User({username:req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("login_register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/secret");
		});
	});
});
//-----------------------

//Login Routes
// Displaying Login Form
// app.get("/login", function(req, res){
// 	res.render("login_register");
// });

//Login logic
app.post("/login", passport.authenticate("local", {
	successRedirect: "/secret",
	failureRedirect: "/loginregister"
}) , function(req, res){
});
//-----------------------

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/");
}

// Catch All
app.get("*", function(req, res){
	res.render("catch_all");
});

app.listen(4000, function(){
	console.log("Server Started.");
});