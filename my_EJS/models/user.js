var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');
const sessionConfig = require('../models/session-config')

router.use(sessionConfig);

// แยกสิทธ์
router.get('/', function(req, res, next) {
  console.log('----> req.session.user in =: ', req.session.user);
  res.render('user/index2', { user_A: req.session.user });
});
  
router.get('/people', function(req, res, next) {
  console.log('req.session.user in /people:', req.session.user);
  res.render('user/index3', { user_B: req.session.user });
});

module.exports = router;
