var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');

router.get('/',(req,res) => {

    const user = req.body.user;
    const password = req.body.password;

    res.render('location/login', {
    user: user , 
    password: password, });

});

router.post('/log', (req, res) => {
    const user = req.body.user;
    const password = req.body.password;
   
        if (!user || !password) {
        res.redirect('/login');
        return;
    }

    // ดึงข้อมูลจากฐานข้อมูล
    dbCon.query('SELECT * FROM login WHERE user = ? AND password = ? ', [user, password], (err, rows) => {
        if (err) {
            // กรณีเกิดข้อผิดพลาดในการ query
            console.error(err);
            res.redirect('/login');
            return;
        }

        // ตรวจสอบว่ามีผู้ใช้ที่ตรงกันหรือไม่
        if (rows.length > 0) {
            // ตรวจสอบว่าเป็น admin หรือไม่
            if (user === 'admin') {
                // เข้าสู่ระบบเป็น admin
                res.redirect('/location');
            } else {
                // เข้าสู่ระบบเป็นผู้ใช้ทั่วไป
                res.render('user/load_data', { rows: rows});
            }
        } else {
            // ไม่พบผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
            res.redirect('/login');
        }
    });
});






module.exports = router;