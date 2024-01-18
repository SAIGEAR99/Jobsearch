var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');
const sessionConfig = require('../middleware/session-config')


router.use(sessionConfig);


// แยกสิทธ์
router.get('/', function(req, res, next) {
  console.log('----> req.session.user in =: ', req.session.user);
  res.render('employee/ep_e_re', { user: req.session.user});
});



router.get('/profile', (req, res, next) => {

    const user = req.session.user;
   
    dbCon.query('SELECT *  FROM user WHERE username LIKE ? ',user ,(err, rows) => {
         if (err) {
             console.error('Error retrieving data:', err);
             res.render('employee/ep_e_home', { rows : rows 
            });
         } else {
             console.log('Data from the database:', rows);
             res.render('employee/ep_e_home', { rows : rows ,
                user: req.session.user
            });
         }
     });
 });


module.exports = router;
