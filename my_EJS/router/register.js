var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');


router.post('/add', (req, res) => {
    let user = req.body.user;
    let email = req.body.email;
    let password = req.body.password;
    let login_id = req.body.login_id;
    let errors = false; // กำหนดค่าตัวแปร errors

    if (user.length === 0 || email.length === 0 || password.length===0 ) {
        errors = true;
        // ตั้งค่าข้อความแฟลช
        req.flash('error', 'กรุณากรอกข้อมูล');
        // เรียก render ไปที่ add.ejs พร้อมกับข้อความแฟลช
        res.render('admin/add', {
            user: user,
            email: email,
            password: password,
            login_id: login_id
        });
    }

    // หากไม่มีข้อผิดพลาด
    if (!errors) {
        let form_data = {
            user: user,
            email: email,
            password: password,
            login_id: login_id
        };

        // คำสั่งใส่ข้อมูล
        dbCon.query('INSERT INTO login SET ?', form_data, (err, result) => {
            if (err) {
                req.flash('error', err);

                res.render('admin/add', {
                    user: form_data.user,
                    email: form_data.email,
                    password: form_data.password,
                    login_id: form_data.login_id
                });
            } else {
                req.flash('success', 'เพิ่มตำแหน่งสำเร็จแล้ว');
                res.redirect('/index');
            }
        });
    }
});

module.exports = router;