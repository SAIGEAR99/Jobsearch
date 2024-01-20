var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');
const { formatDate, calculateAge } = require('../middleware/cal_Date_Age');

const path = require('path');
//const uploadDirectory = path.join(__dirname,  'img');


const sessionConfig = require('../middleware/session-config')
router.use(sessionConfig);

router.get('/file', (req, res) => {
    const username = req.session.user;
    
    // ดึง path จากฐานข้อมูล
    dbCon.query('SELECT * FROM user WHERE username = ?', username, (err, rows) => {
        if (err) {
            // จัดการกับข้อผิดพลาด
            return res.status(500).send(err);
        }

        if (rows.length > 0) {
            const filePath = rows[0].img_profile;
            res.sendFile(filePath, { root: '.' }, (err) => {
                if (err) {
                    // จัดการกับข้อผิดพลาดในการส่งไฟล์
                    res.status(404).send("File not found!");
                }
            });
        } else {
            res.status(404).send("No file associated with the user.");
        }
    });
});


router.get('/file/market', (req, res) => {
    const username = req.session.user;
    
    // ดึง path จากฐานข้อมูล
    dbCon.query(`SELECT user.*, market.mk_img
    FROM user AS user
    JOIN market AS market ON user.market_id = market.market_id
    WHERE user.username = ?`
    , username, (err, rows) => {
        if (err) {
            // จัดการกับข้อผิดพลาด
            return res.status(500).send(err);
        }

        if (rows.length > 0) {
            const filePath = rows[0].mk_img;
            res.sendFile(filePath, { root: '.' }, (err) => {
                if (err) {
                    // จัดการกับข้อผิดพลาดในการส่งไฟล์
                    res.status(404).send("File not found!");
                }
            });
        } else {
            res.status(404).send("No file associated with the user.");
        }
    });
});




router.post('/upload', (req, res) => {
    const user = req.session.user;
    const empY = req.session.isEmployer;
   
    
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let uploadedFile = req.files.uploadedFile;

    // สร้างตำแหน่งสำหรับเก็บไฟล์
    const uploadPath = path.join('./middleware/img', uploadedFile.name);

    uploadedFile.mv(uploadPath, err => {
        if (err) return res.status(500).send(err);

        let query = 'UPDATE user SET img_profile = ? WHERE username = ?;';
        dbCon.query(query, [uploadPath,user], (err, result) => {
            if (err) return res.status(500).send(err);
            dbCon.query(`SELECT user.*, gender.gender AS gender_name,
            address.subdistrict_id,
            subdistricts.name_in_thai AS subdistrict_name,
            subdistricts.zip_code,
            districts.name_in_thai AS district_name,
            provinces.name_in_thai AS province_name,
            role.role AS role_name,
            address.home_number,
            address.village
        FROM user
        LEFT JOIN gender ON user.gender = gender.gender_id
        LEFT JOIN address ON user.address_id = address.address_id
        LEFT JOIN subdistricts ON address.subdistrict_id = subdistricts.id
        LEFT JOIN districts ON subdistricts.district_id = districts.id
        LEFT JOIN provinces ON districts.province_id = provinces.id
        LEFT JOIN role ON user.role = role.role_id
        WHERE user.username LIKE ?`
        , user, (err, rows) => {
                if (empY) {
                    console.error('Error retrieving data:', err);
                    res.render('user/edit_user', { 
                        formatDate , calculateAge,
                        rows: rows ,
                        user: req.session.user
                        
                    });
                } else {
                    console.log('Data from the database-->:', rows);
                    res.render('user/edit_user', { 
                        formatDate , calculateAge,
                        rows: rows ,
                        user: req.session.user 
                    });
                }
                
            });
        });
    });
});


router.post('/upload/market', (req, res) => {
    const user = req.session``.user;
    const empY = req.session.isEmployer;
   
    
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let uploadedFile = req.files.uploadedFile;

    // สร้างตำแหน่งสำหรับเก็บไฟล์
    const uploadPath = path.join('./middleware/img', uploadedFile.name);

    uploadedFile.mv(uploadPath, err => {
        if (err) return res.status(500).send(err);

        let query = 'UPDATE user SET img_profile = ? WHERE username = ?;';
        dbCon.query(query, [uploadPath,user], (err, result) => {
            if (err) return res.status(500).send(err);
            dbCon.query(`SELECT user.*, gender.gender AS gender_name,
            address.subdistrict_id,
            subdistricts.name_in_thai AS subdistrict_name,
            subdistricts.zip_code,
            districts.name_in_thai AS district_name,
            provinces.name_in_thai AS province_name,
            role.role AS role_name,
            address.home_number,
            address.village
        FROM user
        LEFT JOIN gender ON user.gender = gender.gender_id
        LEFT JOIN address ON user.address_id = address.address_id
        LEFT JOIN subdistricts ON address.subdistrict_id = subdistricts.id
        LEFT JOIN districts ON subdistricts.district_id = districts.id
        LEFT JOIN provinces ON districts.province_id = provinces.id
        LEFT JOIN role ON user.role = role.role_id
        WHERE user.username LIKE ?`
        , user, (err, rows) => {
                if (empY) {
                    console.error('Error retrieving data:', err);
                    res.render('user/edit_user', { 
                        formatDate , calculateAge,
                        rows: rows ,
                        user: req.session.user
                        
                    });
                } else {
                    console.log('Data from the database-->:', rows);
                    res.render('user/edit_user', { 
                        formatDate , calculateAge,
                        rows: rows ,
                        user: req.session.user 
                    });
                }
                
            });
        });
    });
});



module.exports = router;