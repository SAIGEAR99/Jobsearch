var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');

const path = require('path');
//const uploadDirectory = path.join(__dirname,  'img');


const sessionConfig = require('../middleware/session-config')


router.use(sessionConfig);

router.get('/file', (req, res) => {
    const user = req.session.user;
    
    // ดึง path จากฐานข้อมูล
    dbCon.query('SELECT * FROM login WHERE user = ?', user, (err, rows) => {
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

        let query = 'UPDATE login SET img_profile = ? WHERE USER = ?;';
        dbCon.query(query, [uploadPath,user], (err, result) => {
            if (err) return res.status(500).send(err);
            dbCon.query('SELECT * FROM login WHERE user = ? ', user, (err, rows) => {
                if (empY) {
                    console.error('Error retrieving data:', err);
                    res.render('employer/ep_y_home', { rows: rows ,
                        user: req.session.user
                        
                    });
                } else {
                    console.log('Data from the database-->:', rows);
                    res.render('employee/ep_e_home', { rows: rows ,
                        user: req.session.user 
                    });
                }
                
            });
        });
    });
});



module.exports = router;