var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');
const sessionConfig = require('../middleware/session-config')


router.use(sessionConfig);


// แยกสิทธ์
router.get('/', function(req, res, next) {
  console.log('----> req.session.user in =: ', req.session.user);
  res.render('employee/ep_e_re', { user_A: req.session.user });
});


module.exports = router;
