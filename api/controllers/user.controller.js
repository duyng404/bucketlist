var mongoose = require('mongoose');
var User = mongoose.model('User');
var List = mongoose.model('List');

module.exports.usrGet = function(req,res){
	var usrid = req.params.usrid;
	console.log ('GET userid', usrid);

	User.
		findById(usrid).
		populate('lists').
		exec(function (err,user){
			var response = {
				status : 200,
				message : user
			};
			if (err) {
				console.log('Error finding user');
				response.status = 500;
				response.message = err;
			} else if (!user) {
				console.log('Cannot find user', usrid);
				response.status = 404;
				response.message = { "message":"User ID not found"};
			}
			res.
				status(response.status).
				json(response.message);
		});
}

module.exports.usrGetAll = function(req,res){
	console.log('GET all and every users');
	User.
		find().
		exec(function(err,listofuser){
			if (err){
				console('Error getting all the users');
				res.
					status(500).
					json(err);
			} else {
				res.
					status(200).
					json(listofuser);
			}
		});
}

module.exports.usrNew = function(req,res){
	User.
		create({
			username : req.body.username,
			email : req.body.email,
			lists : []
		}, function(err,user){
			if (err){
				console.log('Error creating user');
				res.
					status(400).
					json(err);
			} else {
				console.log('User created', user);
				res.
					status(201).
					json(user);
			}
		});
}

module.exports.usrUpdate = function(req,res){
	var usrid = req.params.usrid;
	console.log('UPDATE usrid',usrid);

	User.
		findById(usrid).
		select("-lists").
		exec(function(err,doc) {
			var response = {
				status : 200,
				message : doc
			};
			if (err){
				console.log('Error finding user');
				response.message = err;
			} else if (!doc){
				response.status = 404;
				response.message = {
					"message" : "User ID not found"
				};
			}
			if (response.status != 200) {
				res.
					status(response.status).
					message(response.message);
			} else {
				doc.username = req.body.username;
				doc.email = req.body.email;
				doc.save(function(err,updatedusr){
					if (err){
						console.log('Error updating user');
						res.
							status(500).
							json(err);
					} else {
						console.log('Updated user',usrid)
						res.
							status(204).
							json();
					}
				});
			}
		});
}

var _cleanOrphanedList = function(req,response){
	List.
		remove({ owner : [] }).
		exec(function(err,doc){
			if (err){
				console.log('Error removing orphaned lists')
				response.status = 500;
				response.message = json(err);
			}
		});
}

module.exports.usrDelete = function(req,res) {
	var usrid = req.params.usrid;
	console.log('DELETE an user',usrid)

	User.
		findByIdAndRemove(usrid).
		exec(function(err,user){
			var response = {
				status : 200,
				message : {}
			}
			if (err){
				console.log('Error deleting an user');
				response.status = 404;
				response.message = json(err);
			} else {
				// finding all other lists with that owner
				List.
					update(
						{ owner : user._id },
						{ $pullAll : { owner : [user._id] } },
					function(err,doc){
						if (err){
							console.log('Error cleaning up lists\' owner');
							response.status = 500;
							response.message = json(err);
						} else {
							// deleted and cleaned up succesfully, let's continue
							_cleanOrphanedList(req,response);
							console.log('User deleted:',user);
							response.status = 204;
							response.message = {};
						}
					});
			}
			res.
				status(response.status).
				json(response.message);
		});
}
