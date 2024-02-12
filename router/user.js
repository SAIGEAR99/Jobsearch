var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');
const sessionConfig = require('../middleware/session-config')
const { formatDate, calculateAge,formatDate2,formatTimeToZero,formatCurrency  } = require('../middleware/cal_Date_Age');
const { body } = require('express-validator');


router.use(sessionConfig);


// แยกสิทธ์

router.get('/feed', function(req, res, next) {
  console.log('----> req.session.user in =: ', req.session.userId);

  dbCon.query(`SELECT * FROM market`, [req.session.userId], (err, result) => {
    if (err) {
      // จัดการกับข้อผิดพลาด
      return res.status(500).send(err.message);
    }

    if (result.length > 0) {
      // ดำเนินการต่อหากมีข้อมูล
      dbCon.query('SELECT * FROM market ORDER BY RAND();', (err, rows) => {
        if (err) {
          // จัดการกับข้อผิดพลาด
          return res.status(500).send(err.message);
        }

        // เรนเดอร์หน้าเพียงครั้งเดียวพร้อมข้อมูลที่จำเป็น
        res.render('user/feed_user', { 
          rows: rows,
          market_name: result[0].market_name,
          userId: req.session.userId,
          market_id: result[0].market_id
        });
      });
    } else {
 
      res.render('user/feed_user', { 
        rows: [],
        market_name: '',
        userId: req.session.userId,
        market_id: ''
      });
    }
  });
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

router.get('/show_mk', (req, res) => {
  const market_id = req.query.market_id;

  dbCon.query(`SELECT 
  u.*,
  m.*,
  r.role AS role_name,
  tb.business_name AS business_name,
  g.gender AS gender_name,
  a.*,
  s.name_in_thai AS subdistrict_name,
  d.name_in_thai2 AS district_name,
  p.name_in_thai AS province_name,
  s.zip_code AS zip_code
FROM 
  user u
JOIN 
  market m ON u.market_id = m.market_id
JOIN 
  role r ON u.role = r.role_id
JOIN 
  typebusiness tb ON m.market_type = tb.business_id
JOIN 
  gender g ON u.gender = g.gender_id
JOIN 
  address a ON m.mk_address = a.address_id
JOIN 
  subdistricts s ON a.subdistrict_id = s.id
JOIN 
  districts d ON s.district_id = d.id
JOIN 
  provinces p ON d.province_id = p.id
WHERE 
  m.market_id = ?


  `,[market_id], (err,rows) =>{

    


          if (err) {
              console.error(err);
              // จัดการข้อผิดพลาด
              res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
              return;
          }
      
          res.render('user/sh_mk_user', {
              formatDate, calculateAge, formatDate2, formatTimeToZero,
          rows: rows,
          userId: req.session.userId,
      });
  });
});


router.get('/explore', function(req, res, next) {
  console.log('----> req.session.user in =: ', req.session.userId);

  dbCon.query(`SELECT market.* FROM market INNER JOIN user ON market.market_id = user.market_id WHERE user.user_id = ?`, [req.session.userId], (err, result) => {
    if (err) {
      // จัดการกับข้อผิดพลาด
      return res.status(500).send(err.message);
    }

    if (result.length > 0) {
      // ดำเนินการต่อหากมีข้อมูล
      dbCon.query('SELECT * FROM market ORDER BY RAND();', (err, rows) => {
        if (err) {
          // จัดการกับข้อผิดพลาด
          return res.status(500).send(err.message);
        }

        // เรนเดอร์หน้าเพียงครั้งเดียวพร้อมข้อมูลที่จำเป็น
        res.render('user/explore', { 
          rows: rows,
          market_name: result[0].market_name,
          userId: req.session.userId,
          market_id: result[0].market_id
        });
      });
    } else {
      // จัดการสถานการณ์ที่ไม่มีข้อมูล
      res.render('user/explore', { 
        rows: [],
        market_name: '',
        userId: req.session.userId,
        market_id: ''
      });
    }
  });
});


router.get('/explore/sh_job/:boardId',(req,res) => {

  const boardId = req.params.boardId;

  dbCon.query(`SELECT board.*, market.*, hire.*
  FROM board
  JOIN market ON board.market_id = market.market_id
  JOIN hire ON board.hire_id = hire.hire_id
  WHERE board.board_id = ?
  
  `,[boardId],(err,rows) => {

     


          res.render('user/sh_mk_job',{
              formatDate, calculateAge,formatDate2,formatTimeToZero,formatCurrency,
  
          rows:rows,
          userId: req.session.userId,
          
       

      });

     

  });

 
});

    

module.exports = router;
