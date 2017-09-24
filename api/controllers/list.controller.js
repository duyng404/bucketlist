var mongoose = require('mongoose');
var List = mongoose.model('List');
var User = mongoose.model('User');

module.exports.listGetAll = function(req,res){
	var usrid = req.params.usrid;
	console.log('GET all the lists of usrid', usrid);

	// TODO: actually uses offset and count, for efficiency purpose
	var offset = 0;
	var count = 5;
	var maxCount = 10;

	if (req.query && req.query.offset){
		offset = parseInt(req.query.offset, 10);
	}

	if (req.query && req.query.count){
		count = parseInt(req.query.count, 10);
	}

	if (isNaN(offset) || isNaN(count)){
		res.
			status(400).
			json({ "message" : "invalid offset and/or count" });
		return;
	}

	if (count > maxCount){
		res.
			status(400).
			json({ "message" : "Count limit of "+maxCount+" exceeded" });
		return;
	}

	User.
		findById(usrid).
		populate('lists').
		exec(function (err,user){
			var response = {
				status : 200,
				message : []
			};
			if (err){
				console.log('Error finding user');
				response.status = 500;
				response.message = err;
			} else if (!user) {
				console.log('User id not found',usrid);
				response.status = 404;
				response.message = { "message":"User ID not found"};
			} else {
				console.log('Returned user', user);
				response.message = user.lists ? user.lists : [];
			}
			res.
				status(response.status).
				json(response.message);
		});

}

module.exports.listGetOne = function(req,res){
	var usrid = req.params.usrid;
	var listid = req.params.listid;
	console.log('GET list id', listid, 'of usrid', usrid);

	User.
		findById(usrid).
		populate({
			path : 'lists',
			match : { _id : listid }
		}).
		exec(function (err,user){
			var response={
				status : 200,
				message : {}
			}
			if (err){
				console.log('Error finding user');
				response.status = 500;
				response.message = err;
			} else if(!user) {
				console.log('User id not found', usrid);
				response.status = 404;
				response.message = { "message":"User ID not found"};
			} else {
				// If the list doesn't exist the list is empty
				if (user.lists.length==0){
					response.status = 404;
					response.message = { "message":"list ID not found"};
				} else
				// Get the list
				response.message = user.lists[0];
			}
			res.
				status(response.status).
				json(response.message);
		});
}

var _addList = function(req, res, user){
	list = {
		_id : new mongoose.Types.ObjectId(),
		name : req.body.name,
		order : 0,
		entries : [],
		owner : [user._id]
	}
	List.create(list, function(err,doc){
		if (err){
			console.log('Error creating list');
			res.
				status(400).
				json(err);
		} else {
			console.log('List created',list);
			user.lists.push(list);
			user.save(function(err,doc){
				if (err){
					console.log('Error adding list to user');
					res.
						status(500).
						json(err);
				} else {
					console.log('List added to user');
					res.
						status(201).
						json(list);
				}
			});
		}
	});
}

module.exports.listAddOne = function(req,res){
	var usrid = req.params.usrid;
	console.log('Adding list to',usrid);

	User.
		findById(usrid).
		populate('lists').
		exec(function (err,user){
			var response = {
				status : 200,
				message : []
			};
			if (err){
				console.log('Error finding user');
				response.status = 500;
				response.message = err;
			} else if (!user) {
				console.log('User id not found',usrid);
				response.status = 404;
				response.message = { "message":"User ID not found"};
			}
			if (user) {
				_addList(req,res,user);
			} else {
				res.
					status(response.status).
					json(response.message);
			}
		});
}

module.exports.listUpdateOne = function(req,res){
	var usrid = req.params.usrid;
	var listid = req.params.listid;
	console.log('UPDATE list id', listid, 'of usrid', usrid);
	//TODO: check if list is really owned by usr

	List.
		findById(listid).
		exec(function (err,doc){
			var response = {
				status : 200,
				message : doc
			};
			if (err){
				console.log('Error finding list');
				response.message = err;
			} else if (!doc){
				response.status = 404;
				response.message = {
					"message" : "List ID not found"
				};
			}
			if (response.status != 200) {
				res.
					status(response.status).
					message(response.message);
			} else {
				doc.name = req.body.name;
				doc.save(function(err,updatedlist){
					if (err){
						console.log('Error updating list');
						res.
							status(500).
							json(err);
					} else {
						console.log('Updated list',listid)
						res.
							status(204).
							json();
					}
				});
			}
		});
}
