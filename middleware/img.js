var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');
const { formatDate, calculateAge,formatDate2 } = require('../middleware/cal_Date_Age');
const { getImagePath , getImagePath_b,getImageMk } = require('../middleware/get_img');


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
            res.redirect('/user/profile')
        });
    });
});


router.post('/upload/market', (req, res) => {
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
            res.redirect('/market/profile')
        });
    });
});


router.get('/select/:postId', (req, res) => {
    getImagePath(req.params.postId, (err, filePath) => {
        if (err) {
            console.log(err)
            res.status(404).send("Image not found");
            return;
        }
        res.sendFile(filePath, { root: '.' });
    });
});

router.get('/select_b/:postId', (req, res) => {
    getImagePath_b(req.params.postId, (err, filePath) => {
        if (err) {
            console.log('-->',err)
            res.status(404).send("Image not found");
            return;
        }
        res.sendFile(filePath, { root: '.' });
    });
});

router.get('/mk_img/:userId', (req, res) => {
    getImageMk(req.params.userId, (err, filePath) => {
        if (err) {
            console.log(err)
            res.status(404).send("Image not found");
            return;
        }
        res.sendFile(filePath, { root: '.' });
    });
});




module.exports = router;