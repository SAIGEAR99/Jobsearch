//login.js
var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');
const checkAuth = require('../middleware/checkAuth');

const checkEmployer  = require('../middleware/Check_Employer');
const checkEmployee  = require('../middleware/Check_Emplyee');



router.get('/',(req, res) => {
    res.render('user/login', { user: "", password: "" });
});




// loginRoutes.js
router.post('/log', (req, res) => {
    const user = req.body.user;
    const password = req.body.password;
    const role = req.body.role; // แก้ไปให้เป็น req.body.role

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
            req.session.user = user; // ตั้งค่า user ใน session
            req.session.password = password; // ตั้งค่า password ใน session

            if (user === 'admin') {
                req.session.isLoggedIn = true;
                req.session.isAdmin = true;
                res.redirect('/admin');

            } else if (role === 'employer') { // แก้ให้เปรียบเทียบค่า 'employer'
                req.session.isEmployer = true;
                res.render('user/userdata_a', { rows: rows });
            } else {
                req.session.isEmployee = true;
                res.render('user/userdata_b', { rows: rows });
            }
        } else {
            res.redirect('/login');
        }
    });
});

router.use(checkEmployee);
router.use(checkEmployer);
router.use(checkAuth);


module.exports = router;