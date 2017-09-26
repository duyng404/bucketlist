var mongoose = require('mongoose');
var List = mongoose.model('List');
var User = mongoose.model('User');

module.exports.entryGetAll = function(req,res){
	var usrid = req.params.usrid;
	var listid = req.params.listid;
	console.log('GET entries from list id', listid, 'of usrid', usrid);

	List.
		findById(listid).
		select('entries').
		exec(function (err,doc){
			var response={
				status : 200,
				message : {}
			}
			if (err){
				console.log('Error finding list');
				response.status = 500;
				response.message = err;
			} else if(!doc) {
				console.log('List id not found', usrid);
				response.status = 404;
				response.message = { "message":"List ID not found"};
			} else {
				response.message = doc.entries;
			}
			res.
				status(response.status).
				json(response.message);
		});
}

module.exports.entryGetOne = function(req,res){
	var usrid = req.params.usrid;
	var listid = req.params.listid;
	var entryid = req.params.entryid;
	console.log('GET entry id');

	List.
		findById(listid).
		select('entries').
		exec(function (err,doc){
			var response = {
				status : 200,
				message : {}
			};
			if (err){
				console.log('Error finding list');
				response.status = 500;
				response.message = err;
			} else if (!doc){
				console.log('List ID not found');
				response.status = 404;
				response.message = { "message" : 'List ID not found' };
			} else {
				// Get the entry
				response.message = doc.entries.id(entryid);
				// If the entry doesn't exist Mongoose returns null
				if (!response.message) {
					response.status = 404;
					response.message = { "message" : "entry ID not found" };
				}
			}
			res.
				status(response.status).
				json(response.message);
		});
}

var _addEntry = function(req,response,list){
	list.entries.push({
		_id : mongoose.Types.ObjectId(),
		body : req.body.body,
		order : 0,
		status : 0
	});

	list.save(function(err, listUpdated){
		if (err){
			response.status = 500;
			response.message = json(err);
		} else {
			response.status = 200;
			response.message = listUpdated.entries[listUpdated.entries.length - 1];
		}
	});
}

module.exports.entryAddOne = function(req,res){
	var usrid = req.params.usrid;
	var listid = req.params.listid;
	console.log('POST entries to list id', listid, 'of usrid', usrid);

	List.
		findById(listid).
		select('entries').
		exec(function (err,doc){
			var response={
				status : 200,
				message : {}
			}
			if (err){
				console.log('Error finding list');
				response.status = 500;
				response.message = err;
			} else if(!doc) {
				console.log('List id not found', usrid);
				response.status = 404;
				response.message = { "message":"List ID not found"};
			} else {
				_addEntry(req,response,doc);
			}
			res.
				status(response.status).
				json(response.message);
		});
}
