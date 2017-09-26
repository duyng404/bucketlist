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

module.exports.entryUpdateOne = function(req,res){
	var usrid = req.params.usrid;
	var listid = req.params.listid;
	var entryid = req.params.entryid;
	console.log('PUT entry id',entryid,'of list id',listid,'of user id',usrid);

	List.
		findById(listid).
		select('entries').
		exec(function(err,doc){
			var thisEntry;
			var response = {
				status : 200,
				message : {}
			};
			if (err){
				console.log('Error finding list');
				response.status = 500;
				response.message = err;
			} else if (!doc) {
				console.log('List id not found');
				response.status = 404;
				response.message = { "message" : "list id not found" };
			} else {
				// Get the entry
				thisEntry = doc.entries.id(entryid);
				// If the entry doesn't exist mongoose returns null
				if (!thisEntry) {
					response.status = 404;
					response.message = { "message" : "entry id not found" };
				}
			}
			if (response.status !== 200) {
				res.
					status(response.status).
					json(response.message);
			} else {
				thisEntry.body = req.body.body;
				doc.save(function(err,listUpdated){
					if (err){
						res.
							status(500).
							json(err);
					} else {
						res.
							status(204).
							json();
					}
				});
			}
		});
}

module.exports.entryDeleteOne = function(req, res) {
	var usrid = req.params.usrid;
	var listid = req.params.listid;
	var entryid = req.params.entryid;
	console.log('DELETE entry id',entryid,'of list id',listid,'of user id',usrid);

	List.
		findById(listid).
		select('entries').
		exec(function(err, doc) {
			var thisEntry;
			var response = {
				status : 200,
				message : {}
			};
			if (err) {
				console.log("Error finding list");
				response.status = 500;
				response.message = err;
			} else if(!doc) {
				console.log("List id not found");
				response.status = 404;
				response.message = { "message" : "List ID not found " + id };
			} else {
				// Get the entry
				thisEntry = doc.entries.id(entryid);
				// If the entry doesn't exist Mongoose returns null
				if (!thisEntry) {
					response.status = 404;
					response.message = { "message" : "entry ID not found" };
				}
			}
			if (response.status !== 200) {
				res.
					status(response.status).
					json(response.message);
			} else {
				doc.entries.id(entryid).remove();
				doc.save(function(err, listUpdated) {
					if (err) {
						res
							.status(500)
							.json(err);
					} else {
						res.
							status(204).
							json();
					}
				});
			}
		});
};
