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
    role.role AS role_name
FROM user
LEFT JOIN gender ON user.gender = gender.gender_id
LEFT JOIN role ON user.role = role.role_id
WHERE user.username LIKE ?;`
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

          dbCon.query(`UPDATE user 
          SET gender = (SELECT gender_id FROM gender WHERE gender = ?) 
          WHERE user_id = ?
          `,[gender,user_id],(err) => {
              res.redirect('/user/profile');
            
            });
    });
                       
});
    

module.exports = router;
