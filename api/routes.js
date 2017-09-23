var express = require('express');
var router = express.Router();

ctrl = require('./controllers');

router
	.route('/:usrid')
	.get(ctrl.usrGet);

router
	.route('/lists')
	.get(ctrl.listsGetAll);

router
	.route('/lists/:listid')
	.get(ctrl.listsGetOne);

module.exports = router;
