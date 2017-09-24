var express = require('express');
var router = express.Router();

ctrlUser = require('./controllers/user.controller.js');
ctrlList = require('./controllers/list.controller.js');

router.
	route('/newusr').
	post(ctrlUser.usrNew);

router.
	route('/:usrid').
	get(ctrlUser.usrGet);

router.
	route('/:usrid/lists').
	get(ctrlList.listGetAll).
	post(ctrlList.listAddOne);

router.
	route('/:usrid/lists/:listid').
	get(ctrlList.listGetOne);

module.exports = router;
