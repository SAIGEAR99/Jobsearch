//login.js
var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');
const red_a = require('../middleware/red_a');


router.get('/', red_a, (req, res) => {
    res.render('user/login', { user: "", password: "" });
});

// loginRoutes.js
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
            console.error(err);
            res.redirect('/login');
            return;
        }

        if (rows.length > 0) {
           // req.session.isLoggedIn = true;  // ตรงนี้ต้องตั้งค่าเป็น true เมื่อเข้าสู่ระบบ
            req.session.user = user; // ตั้งค่า user ใน session
            req.session.password = password; // ตั้งค่า password ใน session
         
            
            if (user === 'admin') {
                req.session.isLoggedIn = true;
                req.session.isAdmin = true;
                res.redirect('/admin');
            } else {
                req.session.isRegularUser = true;
                res.render('user/userdata', { rows: rows });
            }
        } else {
            res.redirect('/login');
        }
    });
});


module.exports = router;