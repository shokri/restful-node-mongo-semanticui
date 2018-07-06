var express  = require('express');
var router   = express.Router();
var passport = require('passport');
var User     = require('../models/user');
var moment   = require('moment');

// RESTFUL ROUTES
router.get("/", function(req, res) {
	res.redirect("/blogs");
});

// Auth ROUTES
router.get("/auth/register", function(req, res){
	res.render("auth/register");
});

// Handling User Sign up
router.post("/auth/register", function(req, res){
	req.body.username
	req.body.password
	User.register(new User({
			name: req.body.name,
			email: req.body.email,
			username: req.body.username
		}), req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			return res.render("auth/register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/blogs");
		});
	});
});

// Login Logic
router.get("/auth/login", function(req, res){
	res.render("auth/login");
});

// Middleware(passport.auth...): before callback we hove run some code
router.post("/auth/login", passport.authenticate("local", 
	{
		successRedirect: "/blogs",
		failureRedirect: "/auth/login"
	}), function(req, res){
	
});

// Logout
router.get("/auth/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/auth/login");
}

module.exports = router;