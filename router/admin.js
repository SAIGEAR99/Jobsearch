//admin.js

var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');


// admin.js
router.get('/', (req, res, next) => {
   
   dbCon.query(`SELECT * FROM user
   JOIN role ON user.role = role.role_id
   ORDER BY user.user_id ASC;`
   ,(err, rows) => {
        if (err) {
            console.error('Error retrieving data:', err);
            res.render('admin', { rows: '' });
        } else {
            console.log('Data from the database:', rows);
            res.render('admin', { rows: rows });
        }
    });
});



router.get('/edit/(:login_id)', (req, res, next) => {
    let login_id = req.params.login_id;

    dbCon.query('SELECT * FROM user WHERE user_id = ' + login_id, (err, rows, fields) => {
        if (rows.length <= 0) {
            req.flash('error', 'User not found with id = ' + login_id)
            res.redirect('/admin');
        } else {
            res.render('admin/edit', {
                title: 'Edit User',
                user: rows[0].username,
                email: rows[0].email,
                password: rows[0].password,
                login_id: rows[0].user_id,
                
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
            user_id: login_id
        });
    }

    // หากไม่มีข้อผิดพลาด
    if (!errors) {
        let form_data = {
            user_id: login_id,
            username: user,
            email: email,
            password: password,
            role: 3
            
        };

        // คำสั่งใส่ข้อมูล
        dbCon.query('INSERT INTO user SET ?', form_data, (err, result) => {
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
    let user_id = req.body.login_id;

    let errors = false;

    if (user.length === 0 || email.length === 0 || password.length===0 || user_id.length ===0 ) {
        errors = true;
        req.flash('error', 'Please enter Name and ID');
        res.render('admin/edit', {
                    user: form_data.user,
                    email: form_data.email,
                    password: form_data.password,
                    login_id: form_data.user_id,
        })
    }
    // if no error
    if (!errors) {
        let form_data = {
                    user_id:user_id,
                    username: user,
                    email: email,
                    password:password,
                    
        }
        // update query
        dbCon.query("UPDATE user SET ? WHERE user_id = " + user_id, form_data, (err, result) => {
            if (err) {
                req.flash('error', err);
                res.render('admin/edit', {
                    user: form_data.user,
                    email: form_data.email,
                    password: form_data.password,
                    login_id: form_data.user_id,
                })
            } else {
                req.flash('success', 'Location successfully updated');
                res.redirect('/admin')
            }
        })
    }
});



router.get('/delete/(:login_id)', (req, res, next) => {
    const user_id = req.params.login_id;

    dbCon.query('DELETE FROM user WHERE user_id = ?', user_id, (err, result) => {
        if (err) {
            req.flash('error', err);
            res.redirect('/admin');
        } else {
            req.flash('success', 'Login successfully deleted! ID = ' + user_id);
            res.redirect('/admin');
        }
    })
});



module.exports = router;