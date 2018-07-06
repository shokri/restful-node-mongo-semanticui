var mongoose = require("mongoose");

// POST
var postSchema = new mongoose.Schema({
	text: String,
	created: {type: Date, default: Date.now},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});
module.exports = mongoose.model("Post", postSchema);