var mongoose = require("mongoose"),
	passportLocalMongoose = require("passport-local-mongoose");

// USER 
var userSchema = new mongoose.Schema({
	username: String,
	name: String,
	email: String,
	password: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);