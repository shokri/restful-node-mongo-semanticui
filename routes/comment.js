var express = require('express'),
	router  = express.Router({mergeParams: true}),
	Blog    = require('../models/blog'),
	Post 	= require('../models/post'),
    moment  = require('moment'),
    middleware = require('../middleware');
	

// Comments New 
router.get("/:id", function(req, res){
	// find blog by id 
	Blog.findById(req.params.id, function(err, blog){
		if (err) {
			console.log(err);
		} else {
			res.redirect("/blogs/" + blog._id, {blog: blog, commDate: moment(blog.created).fromNow()});
		}
	})
});

// Comments Create 
router.post('/:id', middleware.isLoggedIn, function(req, res){
	//lookup blog using ID 
	Blog.findById(req.params.id, function(err, blog){
		if (err) {
			console.log(err);
			res.redirect("/blogs");
		} else {
			Post.create(req.body.comment, function(err, comment){
				if (err) {
					console.log(err);
				} else {
					comment.author.id 		= req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					blog.comments.push(comment);
					blog.save();
					res.redirect("/blogs/" + blog._id);
				}
			});
		}
	});
});

// editing comment
router.get("/:id/comment/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Post.findById(req.params.comment_id, function(err, foundComment) {
		if (err) {
			res.redirect("back");
		} else {
	    	res.render("comments/edit", {blog_id: req.params.id, comment: foundComment});
		}
	});
});

// updating comment 
router.put("/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Post.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedBlogs){
		try {
			res.redirect("/blogs/" + req.params.id);
		} catch(err) {
			res.redirect("back");
		}
	});
});

// delete comment
router.delete("/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Post.findByIdAndRemove(req.params.comment_id, function(err){
		try {
			res.redirect("/blogs/" + req.params.id);
		} catch(err) {
			res.redirect("back");
		}
	});
});

module.exports = router;