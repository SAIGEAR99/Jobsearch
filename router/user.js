var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');
const sessionConfig = require('../middleware/session-config')
const { formatDate, calculateAge,formatDate2 } = require('../middleware/cal_Date_Age');
const { body } = require('express-validator');


router.use(sessionConfig);


// แยกสิทธ์
router.get('/feed', function(req, res, next) {
  console.log('----> req.session.user in =: ', req.session.user);
  res.render('user/feed_user', { user: req.session.user});
});

router.get('/register/market', function(req, res, next) {
    console.log('----> req.session.user in =: ', req.session.user);
    res.render('user/register_market', {  user: "", search: "",about:""});
  });



router.get('/profile', (req, res, next) => {

    const user = req.session.user;
   
    dbCon.query(`SELECT user.*, gender.gender AS gender_name,
    address.subdistrict_id,
    subdistricts.name_in_thai AS subdistrict_name,
    subdistricts.zip_code,
    districts.name_in_thai2 AS district_name,
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
             res.render('user/edit_user', { 
                formatDate , calculateAge,formatDate2,
                rows : rows ,
                user: req.session.user 
            });
         } else {
             console.log('Data from the database:', rows);
             res.render('user/edit_user', {
                formatDate , calculateAge,formatDate2,
                rows : rows ,
                user: req.session.user
            });
         }
     });
 });


 router.get('/feed', function(req, res, next) {
    console.log('----> req.session.user in =: ', req.session.user);
    res.render('user/feed_user', { user: req.session.user});
  });
  
  router.get('/register/market', function(req, res, next) {
      console.log('----> req.session.user in =: ', req.session.user);
      res.render('user/register_market', {  user: "", search: "",about:""});
    });
  
  



  
  router.post('/update_profileEdit', (req, res, next) => {
  

      const user_id = req.body.user_id;
      const username = req.body.username;
      const name = req.body.name;
      const surname = req.body.surname;
      const b_date = req.body.b_date;
      const email = req.body.email;
      const about = req.body.aboutme;
      const phone_no = req.body.phoneNumber;
      const h_num = req.body.homeNumber;
      const village = req.body.village;

      const subdistrict_client = req.body.subdistrict;
      const district =  req.body.district;
      

      const gender = req.body.gender;

      console.log('post----->',req.body.gender)

        let form_dataUser = {
            username: username ,
            name: name,
            surname: surname,
            birthday: b_date,
            email: email,
            about: about,
            phone_no: phone_no ,
            user_id : user_id, 
        }
      dbCon.query(`
      UPDATE user
      SET 
          username = ?, 
          name = ?, 
          surname = ?, 
          birthday = ?, 
          email = ?,
          about = ?, 
          phone_no = ?
      WHERE user_id = ?;
  `
      ,[form_dataUser.username, form_dataUser.name
        , form_dataUser.surname, 
        form_dataUser.birthday,form_dataUser.email, form_dataUser.about,
         form_dataUser.phone_no, form_dataUser.user_id],(err) => {

            let form_dataAdress1 = {
                home_number: h_num   ,
                village: village,
                user_id: user_id,
            }

            dbCon.query(`UPDATE address
            SET 
                home_number = ? , 
                village = ?
            WHERE address_id = (
                SELECT address_id
                FROM user
                WHERE user_id = ?
            );
            `, [form_dataAdress1.home_number,
                form_dataAdress1.village,
                form_dataAdress1.user_id],(err) => {


                    let form_dataAdress2 = {
                        name_in_thai: subdistrict_client,
                        name_in_thai2 : district ,

                        user_id: user_id,


                    }
                    dbCon.query(`UPDATE address
                    SET subdistrict_id = (
                        SELECT s.id
                        FROM subdistricts s
                        INNER JOIN districts d ON s.district_id = d.id
                        WHERE s.name_in_thai = ? AND d.name_in_thai2 = ?
                    )
                    WHERE address_id = (
                        SELECT a.address_id
                        FROM user u
                        INNER JOIN address a ON u.address_id = a.address_id
                        WHERE u.user_id = ?
                    );

                    `,[form_dataAdress2.name_in_thai,
                        form_dataAdress2.name_in_thai2,
                        form_dataAdress2.user_id], (err) => {

                            dbCon.query(`UPDATE user 
                            SET gender = (SELECT gender_id FROM gender WHERE gender = ?) 
                            WHERE user_id = ?
                            `,[gender,user_id],(err) => {

                                res.redirect('/user/profile');

                            });
                       

                      
                    });
            });
           
       });
   });






module.exports = router;
