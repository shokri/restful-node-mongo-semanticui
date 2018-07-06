var express 	= require('express'),
	router  	= express.Router(),
	passport	= require('passport'),
	Blog    	= require('../models/blog'),
	moment  	= require('moment'),
	middleware  = require('../middleware');

// INDEX ROUTES
router.get("/", function(req, res){
	Blog.find({}, function(err, blogItems) {
		if (err) {
			console.log("Error!!!");
		} else {
			res.render("index", {Blogs: blogItems, currentUser: req.user, time: moment(blogItems.created).fromNow()});
		}
	});
});

// NEW ROUTES
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("blogs/new");
});

// CREATE ROUTES
router.post("/new", middleware.isLoggedIn, function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	req.body.blog.author = author;

	Blog.create(req.body.blog, function(err, newBlog) {
		if (err) {
			res.render("blogs/new");
		} else {
			res.redirect("/blogs");
		}
	})
});

// Post.create({comment: "this is a comment"}, function(err, post){
// 	User.findOne({email: "jsins871@gmail.com"}, function(err, user){
// 		user.posts.push(post);
// 		user.save(function(err, save){
// 			console.log(save);
// 		});
// 	});
// });

// SHOW ROUTES
router.get("/:id", function(req, res){
	// Blog.findById(req.params.id, function(err, blogPost) {
	// 	try {
	// 		res.render("show", {blog: blogPost});
	// 	} catch(err) {			
	// 		res.redirect("/blogs");
	// 	}
	// });
	Blog.findById(req.params.id).populate("comments").exec(function(err, blogPost){
		try {
			res.render('blogs/show', {blog: blogPost, moment: moment(blogPost.created).fromNow()});
		} catch(err) {
			res.redirect('/blogs');
		}
	});
});

// EDIT ROUTES
router.get("/:id/edit", middleware.checkBlogOwnership, function(req, res){
	Blog.findById(req.params.id, function(err, blogPost) {
		res.render("blogs/edit", {blog: blogPost});		
	});
});

// UPDATE ROUTES
router.put("/:id", middleware.checkBlogOwnership, function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlogs){
		try {
			res.redirect("/blogs/" + req.params.id);
		} catch(err) {
			res.redirect("/blogs");
		}
	});
});

// DELETE ROUTES
router.delete("/:id", middleware.checkBlogOwnership, function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		try {
			res.redirect("/blogs");
		} catch(err) {
			res.redirect("/blogs");
		}
	});
});

module.exports = router;