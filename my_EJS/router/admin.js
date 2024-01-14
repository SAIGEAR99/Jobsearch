//admin.js

var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');


// admin.js
router.get('/', (req, res, next) => {
   
   dbCon.query('SELECT * FROM login ORDER BY login_id ASC', (err, rows) => {
        if (err) {
            console.error('Error retrieving data:', err);
            res.render('admin', { data: '' });
        } else {
            console.log('Data from the database:', rows);
            res.render('admin', { data: rows });
        }
    });
});



router.get('/edit/(:login_id)', (req, res, next) => {
    let login_id = req.params.login_id;

    dbCon.query('SELECT * FROM login WHERE login_id = ' + login_id, (err, rows, fields) => {
        if (rows.length <= 0) {
            req.flash('error', 'User not found with id = ' + login_id)
            res.redirect('/admin');
        } else {
            res.render('admin/edit', {
                title: 'Edit User',
                user: rows[0].user,
                email: rows[0].email,
                password: rows[0].password,
                login_id: rows[0].login_id,
                
            })
        }
    });
})


router.get('/add',(req,res) => {
    res.render('admin/add', {
        user:'',
        email:'',
        password: '',
        login_id: ''

    });
});

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
                res.redirect('/admin');
            }
        });
    }
});

router.post('/update/:login_id', (req, res, next) => {
    let user = req.body.user;
    let email = req.body.email;
    let password = req.body.password;
    let login_id = req.body.login_id;

    let errors = false;

    if (user.length === 0 || email.length === 0 || password.length===0 || login_id.length ===0 ) {
        errors = true;
        req.flash('error', 'Please enter Name and ID');
        res.render('admin/edit', {
            user: form_data.user,
                    email: form_data.email,
                    password: form_data.password,
                    login_id: form_data.login_id,
        })
    }
    // if no error
    if (!errors) {
        let form_data = {
                    user: user,
                    email: email,
                    password:password,
                    login_id:login_id,
        }
        // update query
        dbCon.query("UPDATE login SET ? WHERE login_id = " + login_id, form_data, (err, result) => {
            if (err) {
                req.flash('error', err);
                res.render('admin/edit', {
                    user: form_data.user,
                    email: form_data.email,
                    password: form_data.password,
                    login_id: form_data.login_id,
                })
            } else {
                req.flash('success', 'Location successfully updated');
                res.redirect('/admin')
            }
        })
    }
});



router.get('/delete/(:login_id)', (req, res, next) => {
    let login_id = req.params.login_id;

    dbCon.query('DELETE FROM login WHERE login_id = ?', login_id, (err, result) => {
        if (err) {
            req.flash('error', err);
            res.redirect('/admin');
        } else {
            req.flash('success', 'Login successfully deleted! ID = ' + login_id);
            res.redirect('/admin');
        }
    })
});



module.exports = router;