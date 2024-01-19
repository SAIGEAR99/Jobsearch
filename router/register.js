var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');
const path = require('path');

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

module.exports = router;