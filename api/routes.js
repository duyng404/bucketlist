var express = require('express');
var router = express.Router();

ctrlUser = require('./controllers/user.controller.js');
ctrlList = require('./controllers/list.controller.js');
ctrlEntry = require('./controllers/entry.controller.js');

// user routes
router.
	route('/newusr').
	post(ctrlUser.usrNew);

router.
	route('/:usrid').
	get(ctrlUser.usrGet).
	put(ctrlUser.usrUpdate).
	delete(ctrlUser.usrDelete);

// list routes
router.
	route('/:usrid/lists').
	get(ctrlList.listGetAll).
	post(ctrlList.listAddOne);

router.
	route('/:usrid/lists/:listid').
	get(ctrlList.listGetOne).
	put(ctrlList.listUpdateOne).
	delete(ctrlList.listDeleteOne);

// entry routes
router.
	route('/:usrid/lists/:listid/entries').
	get(ctrlEntry.entryGetAll).
	post(ctrlEntry.entryAddOne);

router.
	route('/:usrid/lists/:listid/entries/:entryid').
	get(ctrlEntry.entryGetOne)

// debug routes
router.
	route('/debug/alllists').
	get(ctrlList.listGetEverything);

router.
	route('/debug/alluser').
	get(ctrlUser.usrGetAll);

module.exports = router;
