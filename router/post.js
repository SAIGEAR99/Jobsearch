var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');
const sessionConfig = require('../middleware/session-config')



router.use(sessionConfig);


router.post('/feed', (req,res) => {
    res.render('post/mn_post')


});


module.exports = router;

