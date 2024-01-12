var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');




router.get('/', function(req, res, next) {
  res.render('user/load_data')
});
  
module.exports = router;
