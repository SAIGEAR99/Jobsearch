var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');
const sessionConfig = require('../middleware/session-config')
const { formatDate, calculateAge } = require('../middleware/cal_Date_Age');


router.use(sessionConfig);


// แยกสิทธ์
router.get('/', function(req, res, next) {
  console.log('----> req.session.user in =: ', req.session.user);
  res.render('employee/ep_e_re', { user: req.session.user});
});



router.get('/profile', (req, res, next) => {

    const user = req.session.user;
   
    dbCon.query(`SELECT user.*, gender.gender AS gender_name,
    address.subdistrict_id,
    subdistricts.name_in_thai AS subdistrict_name,
    subdistricts.zip_code,
    districts.name_in_thai AS district_name,
    provinces.name_in_thai AS province_name,
    role.role AS role_name,
    address.home_number,
    address.village
FROM user
LEFT JOIN gender ON user.gender = gender.gender_id
LEFT JOIN address ON user.address_id = address.address_id
LEFT JOIN subdistricts ON address.subdistrict_id = subdistricts.id
LEFT JOIN districts ON subdistricts.district_id = districts.id
LEFT JOIN provinces ON districts.province_id = provinces.id
LEFT JOIN role ON user.role = role.role_id
WHERE user.username LIKE ?`
    ,user ,(err, rows) => {
         if (err) {
             console.error('Error retrieving data:', err);
             res.render('employee/ep_e_home', { 
                formatDate , calculateAge,
                rows : rows ,
                user: req.session.user 
            });
         } else {
             console.log('Data from the database:', rows);
             res.render('employee/ep_e_home', {
                formatDate , calculateAge,
                rows : rows ,
                user: req.session.user
            });
         }
     });
 });


module.exports = router;
