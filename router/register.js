var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');
const path = require('path');
const { formatDate, calculateAge } = require('../middleware/cal_Date_Age');

const sessionConfig = require('../middleware/session-config')
router.use(sessionConfig);

router.get('/',(req, res) => {
    res.render('user/register', { user: "", password: "",email:"", password_auth:"",});
});

router.post('/add', (req, res) => {
    let user = req.body.user;
    let email = req.body.email;
    let password = req.body.password;
    let errors = false; // Set variable errors to false

    let password_auth = req.body.password_auth;


    if (password === password_auth) {

        if (user.length === 0 || email.length === 0 || password.length === 0) {
            errors = true;
            // Set flash message
            req.flash('error', 'กรุณากรอกข้อมูล');
            // Render add.ejs with flash message
            return res.render('user/register', {
                user: user,
                email: email,
                password: password,
            });
        }
        const uploadPath = path.join('./middleware/img','../img/aa.jpg');
        // If no errors
        if (!errors) {
            let form_data = {
                username: user,
                email: email,
                password: password,
                role : 3 ,
                img_profile : uploadPath,
                name : 'ไม่ระบุ',
                surname : 'ไม่ระบุ',
                gender : 4
            };

            // Insert data
            dbCon.query('INSERT INTO user SET ?', form_data, (err, result) => {
                if (err) {
                    console.error(err);
                    console.log('error database :', JSON.stringify(err));


                    return res.render('user/register', {
                        user: form_data.username,
                        email: form_data.email,
                        password: form_data.password,
                        password_auth: password,

                    });
                } else {
                    req.flash('success', 'เพิ่มตำแหน่งสำเร็จแล้ว');
                    return res.redirect('/login');
                }
            });
        }
    } else {
        req.flash('error', 'รหัสผ่านไม่ตรงกับการยืนยัน');
        return res.redirect('/register');
    }
});


router.post('/add/business', (req, res) => {
    // Retrieve values from session and request body
    let userId = req.session.userId;
    let marketName = req.body.user;
    let businessName = req.body.search; // This should be the name of the business, not the type
    let marketAbout = req.body.about;
  
    // Begin transaction
    dbCon.beginTransaction((err) => {
      if (err) { throw err; }
  
      // Find the business_id from the business_name
      dbCon.query('SELECT business_id FROM typebusiness WHERE business_name = ?', [businessName], (err, results) => {
        if (err) {
          return dbCon.rollback(() => {
            res.status(500).send({
              message: 'Error finding business type',
              error: err.message
            });
          });
        }
  
        // Check if business type exists
        if (results.length === 0) {
          return dbCon.rollback(() => {
            res.status(404).send({
              message: 'Business type not found'
            });
          });
        }
  
        const businessId = results[0].business_id;
  
        // Insert a new address
        dbCon.query('INSERT INTO address (subdistrict_id) VALUES (?)', [999999], (err, results) => {
          if (err) {
            return dbCon.rollback(() => {
              res.status(500).send({
                message: 'Error inserting address',
                error: err.message
              });
            });
          }
  
          const newAddressId = results.insertId;
          const uploadPath = path.join('./middleware/img','../img/aa.jpg');
        
  
          // Insert a new market with the business_id
          dbCon.query('INSERT INTO market (market_name, market_type, mk_address, mk_discript,mk_img) VALUES (?, ?, ?, ?,?)', [marketName, businessId, newAddressId, marketAbout,uploadPath], (err, results) => {
            if (err) {
              return dbCon.rollback(() => {
                res.status(500).send({
                  message: 'Error inserting market',
                  error: err.message
                });
              });
            }
  
            const newMarketId = results.insertId;
  
            // Update the user with the new market_id
            dbCon.query('UPDATE user SET market_id = ? WHERE user_id = ?', [newMarketId, userId], (err, results) => {
              if (err) {
                return dbCon.rollback(() => {
                  res.status(500).send({
                    message: 'Error updating user',
                    error: err.message
                  });
                });
              }

              dbCon.query('UPDATE user SET market_id = ?, role = 2 WHERE user_id = ?', [newMarketId, userId], (err, results) => {
                if (err) {
                  return dbCon.rollback(() => {
                    res.status(500).send({
                      message: 'Error updating user',
                      error: err.message
                    });
                  });
                }
                req.session.role = 2;
                req.session.isEmployer = true;
                req.session.isEmployee = false;

              // Commit the transaction
              dbCon.commit((err) => {
                if (err) {
                  return dbCon.rollback(() => {
                    res.status(500).send({
                      message: 'Error committing transaction',
                      error: err.message
                    });
                  });
                }
                // Send a response to the client
                 res.redirect('/market/profile')
                });
              });
            });
          });
        });
      });
    });
  });
  





module.exports = router;