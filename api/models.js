var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var entrySchema = new mongoose.Schema({
	body : String,
	order : {
		type : Number,
		"default" : 0
	},
	status : {
		type : Number,
		"default" : 0
	}
});

var listSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true
	},
	order : {
		type : Number,
		"default" : 0
	},
	entries : [entrySchema],
	owner : { type : Schema.Types.ObjectId, ref: 'User' }
});

var userSchema = new mongoose.Schema({
	username : {
		type: String,
		required : true
	},
	email : {
		type : String,
		required : true
	},
	lists : [{ type : Schema.Types.ObjectId, ref : 'List' }]
});

var List = mongoose.model('List',listSchema);
var User = mongoose.model('User',userSchema);
