var mongoose = require("mongoose");

var catSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	createdAt: { type: Date, default: Date.now },
	comments:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Comment"
	}]
});

module.exports = mongoose.model("Cat", catSchema);
