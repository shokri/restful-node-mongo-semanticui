// all middleware goes here
var Blog = require('../models/blog'),
	Post = require('../models/post');

var middlewareObj = {
	checkBlogOwnership: function(req, res, next) {
		if (req.isAuthenticated()) {
			Blog.findById(req.params.id, function(err, blogPost) {
				if (err) {
					res.redirect("back");
				} else {				
					// does user own the blog?
					if (blogPost.author.id.equals(req.user._id)) {
						next();
					} else {
						res.redirect("back");
					}
				}		
			});
		} else {
			res.redirect("back");
		}
	},
	checkCommentOwnership: function(req, res, next) {
		if (req.isAuthenticated()) {
			Post.findById(req.params.comment_id, function(err, foundComment) {
				if (err) {
					res.redirect("back");
				} else {				
					// does user own the blog?
					if (foundComment.author.id.equals(req.user._id)) {
						next();
					} else {
						res.redirect("back");
					}
				}		
			});
		} else {
			res.redirect("back");
		}	
	},
	isLoggedIn: function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		res.redirect("/auth/login");
	}
};


module.exports = middlewareObj