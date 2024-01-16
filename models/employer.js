var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');
const sessionConfig = require('../middleware/session-config')


router.use(sessionConfig);


// แยกสิทธ์
router.get('/', function(req, res, next) {
  console.log('----> req.session.user in =: ', req.session.user);
  res.render('employer/ep_y_re', { user_B: req.session.user });
});



module.exports = router;