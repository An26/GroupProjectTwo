var express = require('express');
var router = express.Router();
//var cat = require('../models/cat.js');

router.get('/', function (req, res) {
	res.redirect('/index');
});

module.exports = router;
