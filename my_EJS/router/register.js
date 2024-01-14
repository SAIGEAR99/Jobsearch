var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');

router.get('/',(req, res) => {
    res.render('user/register', { user: "", password: "",email:"", password_auth:"",});
});

router.post('/add', (req, res) => {
    let user = req.body.user;
    let email = req.body.email;
    let password = req.body.password;
    let login_id = req.body.login_id;
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
                login_id: login_id
            });
        }

        // If no errors
        if (!errors) {
            let form_data = {
                user: user,
                email: email,
                password: password,
                login_id: login_id
            };

            // Insert data
            dbCon.query('INSERT INTO login SET ?', form_data, (err, result) => {
                if (err) {
                    req.flash('error', err);

                    return res.render('user/register', {
                        user: form_data.user,
                        email: form_data.email,
                        password: form_data.password,
                        login_id: form_data.login_id
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