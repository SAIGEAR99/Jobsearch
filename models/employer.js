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

router.get('/profile', (req, res, next) => {

    const user = req.session.user;
   
    dbCon.query('SELECT *  FROM login WHERE user LIKE ? ',user ,(err, rows) => {
         if (err) {
             console.error('Error retrieving data:', err);
             res.render('employer/ep_y_home', { rows : rows 
            });
         } else {
             console.log('Data from the database:', rows);
             res.render('employer/ep_y_home', { rows : rows,
                    user: req.session.user
            });
         }
     });
 });






module.exports = router;