var express = require('express');
var router = express.Router();

ctrl = require('./controllers');

router.
	route('/newusr').
	post(ctrl.usrNew);

router.
	route('/:usrid').
	get(ctrl.usrGet);

router.
	route('/:usrid/lists').
	get(ctrl.listGetAll).
	post(ctrl.listAddOne);

router.
	route('/:usrid/lists/:listid').
	get(ctrl.listGetOne);

module.exports = router;
