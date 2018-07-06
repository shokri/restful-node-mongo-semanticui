var bodyParser   	  = require("body-parser"),
methodOverride   	  = require("method-override"),
expressSanitizer 	  = require("express-sanitizer"),
mongoose         	  = require("mongoose"),
express          	  = require("express"),
app              	  = express(),
Blog 			 	  = require("./models/blog"),
Post 			 	  = require("./models/post"),
User 			 	  = require("./models/user"),
passport		 	  = require("passport"),
session				  = require("express-session"),
localStrategy	 	  = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose"),
moment				  = require('moment');
robot           	  = require("robotjs");

var blogRoutes = require('./routes/blog'),
    indexRoutes = require('./routes/index'),
    commentRoutes = require('./routes/comment');

// APP CONFIG
mongoose.connect("mongodb://localhost/we_love_cats");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// SESSION
app.use(session({
	secret: "write anythings",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

passport
	.use(new localStrategy(User.authenticate()))
	.serializeUser(User.serializeUser())
	.deserializeUser(User.deserializeUser());

app.use("/", indexRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs", commentRoutes);



app.listen(3000, function() {
	console.log("Server is now working");
});