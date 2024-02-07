var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');
const sessionConfig = require('../middleware/session-config')
const { formatDate, calculateAge,formatDate2,formatTimeToZero } = require('../middleware/cal_Date_Age');


router.use(sessionConfig);


router.get('/feed', function(req, res, next) {
    console.log('----> req.session.user in =: ', req.session.userId);
  
    dbCon.query(`SELECT market.* FROM market INNER JOIN user ON market.market_id = user.market_id WHERE user.user_id = ?`, [req.session.userId], (err, result) => {
      if (err) {
        // จัดการกับข้อผิดพลาด
        return res.status(500).send(err.message);
      }
  
      if (result.length > 0) {
        // ดำเนินการต่อหากมีข้อมูล
        dbCon.query('SELECT * FROM market', (err, rows) => {
          if (err) {
            // จัดการกับข้อผิดพลาด
            return res.status(500).send(err.message);
          }
  
          // เรนเดอร์หน้าเพียงครั้งเดียวพร้อมข้อมูลที่จำเป็น
          res.render('market/feed_market', { 
            rows: rows,
            market_name: result[0].market_name,
            userId: req.session.userId,
            market_id: result[0].market_id
          });
        });
      } else {
        // จัดการสถานการณ์ที่ไม่มีข้อมูล
        res.render('market/feed_market', { 
          rows: [],
          market_name: '',
          userId: req.session.userId,
          market_id: ''
        });
      }
    });
  });
  
router.get('/profile', (req, res, next) => {

    const user = req.session.userId;
   
    dbCon.query(`SELECT 
    u.*,
    m.*,
    r.role AS role_name,
    g.gender AS gender_name
    
FROM 
    user u
JOIN 
    market m ON u.market_id = m.market_id
JOIN 
    role r ON u.role = r.role_id
JOIN 
    gender g ON u.gender = g.gender_id

WHERE 
    u.user_id = ?

`
    ,user ,(err, rows) => {
         if (err) {
             console.error('Error retrieving data:', err);
             res.render('market/edit_market', { 
                formatDate , calculateAge,formatDate2,formatTimeToZero,
                rows : rows ,
                user: req.session.user 
            });
         } else {
             console.log('Data from the database:', rows);
             res.render('market/edit_market', {
                formatDate , calculateAge,formatDate2,formatTimeToZero,
                rows : rows ,
                user: req.session.user
            });
         }
     });
 });

router.get('/profile/business', (req, res, next) => {

    const user = req.session.userId;
   
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
    u.user_id = ?
`
    ,user ,(err, rows) => {
         if (err) {
             console.error('Error retrieving data:', err);
             res.render('market/edit_mk', { 
                formatDate , calculateAge,formatDate2,formatTimeToZero,
                rows : rows ,
                user: req.session.user 
            });
         } else {
             console.log('Data from the database:', rows);
             res.render('market/edit_mk', {
                formatDate , calculateAge,formatDate2,formatTimeToZero,
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

                              res.redirect('/market/profile');

                          });
                     

                    
                  });
          });
         
     });
 });



 router.post('/update_profile/business', (req, res, next) => {

    const user_id = req.session.userId;


    
    const b_name = req.body.businessName;

    const b_type = req.body.businessType;


    const b_timeO = req.body.businessOpenTime;
    const b_timeC = req.body.businessCloseTime;
    const b_dayO= req.body.businessDaysOpen;
    const b_darC = req.body.businessDaysClosed;

    console.log('----------------------->>',b_timeO,b_dayO)

    const b_phone = req.body.businessPhone;
    const b_contact = req.body.contactChannel;
    const h_num = req.body.homeNumber;
    const village = req.body.village;
    const about = req.body.aboutBusiness;

    const subdistrict_client = req.body.subdistrict;
    const district =  req.body.district;

      let form_dataUser = {
        market_name : b_name ,
        mk_phone : b_phone,
        mk_contact : b_contact,
        mk_discript : about,

        mk_day_op:b_dayO,
        mk_day_close:b_darC,
        mk_time_op:b_timeO,
        mk_time_close:b_timeC,
        mk_contact:b_contact,
        mk_phone:b_phone,

          user_id : user_id, 
      }
    dbCon.query(`
    UPDATE market m
JOIN user u ON m.market_id = u.market_id
SET 
    m.market_name = ?, 
    m.mk_phone = ?, 
    m.mk_contact = ?, 
    m.mk_discript = ?,

    m.mk_day_op = ?,
    m.mk_day_close = ?,
    m.mk_time_op = ?,
    m.mk_time_close = ?,
    m.mk_contact = ?,
    m.mk_phone = ?

WHERE u.user_id = ?;

`
    ,[form_dataUser.market_name,form_dataUser.mk_phone,form_dataUser.mk_contact,form_dataUser.mk_discript,
        form_dataUser.mk_day_op,form_dataUser.mk_day_close,form_dataUser.mk_time_op,form_dataUser.mk_time_close,
        form_dataUser.mk_contact,form_dataUser.mk_phone,form_dataUser.user_id],(err) => {

          let form_dataAdress1 = {
              home_number: h_num   ,
              village: village,
              user_id: user_id,
          }

          dbCon.query(`UPDATE address
          JOIN market ON address.address_id = market.mk_address
          JOIN user ON market.market_id = user.market_id
          SET address.home_number = ?, 
              address.village = ?
          WHERE user.user_id = ?
          `, [form_dataAdress1.home_number,
              form_dataAdress1.village,
              form_dataAdress1.user_id],(err) => {

  
    dbCon.query(`
    UPDATE address AS addr
INNER JOIN market AS mkt ON addr.address_id = mkt.mk_address
INNER JOIN user AS usr ON mkt.market_id = usr.market_id
SET addr.subdistrict_id = (
    SELECT s.id
    FROM subdistricts s
    INNER JOIN districts d ON s.district_id = d.id
    WHERE s.name_in_thai = ? AND d.name_in_thai2 = ?
)
WHERE usr.user_id = ?
`
    ,[subdistrict_client,district,user_id],(err) => { 

        let ff = {
            business_name: b_type,
            user_id: user_id
        }

        dbCon.query(`
        UPDATE market 
JOIN user ON market.market_id = user.market_id 
JOIN typebusiness ON market.market_type = typebusiness.business_id
SET market.market_type = (
    SELECT business_id 
    FROM typebusiness 
    WHERE business_name = ?
)
WHERE user.user_id = ?

`,[ff.business_name,ff.user_id],(err)=> {
            res.redirect('/market/profile/business');

        });

        
       });
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
    
        res.render('market/sh_mk', {
            formatDate, calculateAge, formatDate2, formatTimeToZero,
            rows: rows
        });
    });
});


module.exports = router;
