var mongoose = require('mongoose');
var List = mongoose.model('List');
var User = mongoose.model('User');

module.exports.usrGet = function(req,res){
	var usrid = req.params.usrid;
	console.log ('GET userid', usrid);

	User.
		findById(usrid).
		populate('lists').
		exec(function (err,user){
			res.
				status(200).
				json(user);
		});
}

module.exports.listsGetAll = function(req,res){
	console.log('GET all the lists');

	var offset = 0;
	var count = 5;

	if (req.query && req.query.offset){
		offset = parseInt(req.query.offset, 10);
	}

	if (req.query && req.query.count){
		count = parseInt(req.query.count, 10);
	}

	List
		.find()
		.skip(offset)
		.limit(count)
		.exec(function(err,lists){
			console.log("found lists", lists.length);
			res
				.json(lists);
		});
}

module.exports.listsGetOne = function(req,res){
	var listid = req.params.hotelid;
	console.log("GET listid", listid);

	List
		.findById(listid)
		.exec(function(err,doc){
			res
				.status(200)
				.json(doc);
		});
}
