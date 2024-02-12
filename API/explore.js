var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');
const path = require('path');
const { formatDate, calculateAge,formatDate2,formatTimeToZero,formatCurrency } = require('../middleware/cal_Date_Age');

const sessionConfig = require('../middleware/session-config');
const { error } = require('console');

router.use(sessionConfig);


router.get('/api/boards', function(req, res) {
    const pageEx = parseInt(req.query.page) || 0;
    const limitEx = parseInt(req.query.limit) || 5;
    const offset = pageEx * limitEx;

 
    // ส่งคำสั่ง SQL เพื่อดึงข้อมูลโพสต์จากฐานข้อมูล
    const sql = `SELECT board.*, market.*,hire.*
    FROM board
    JOIN market ON board.market_id = market.market_id 
    JOIN hire ON board.hire_id = hire.hire_id 
    ORDER BY board.board_id DESC
    LIMIT ? , ?
    `;
    dbCon.query(sql, [offset, limitEx], function(err, results) {
        if (err) {
            console.error('Error querying MySQL database:', err);
            res.status(500).json({ error: 'Internal server error' });
            return; }
            const formattedResults = results.map(board => {
                return { ...board, board_date: formatDate2(board.board_date),board_rate:formatCurrency(board.board_rate) };
            });
        
            res.json(formattedResults);
    });
});

router.get('/api/boards/mk', function(req, res) {
    const pageEx = parseInt(req.query.page) || 0;
    const limitEx = parseInt(req.query.limit) || 5;
    const offset = pageEx * limitEx;
    const yourMkId = req.query.mk_id;
    const userId = req.session.userId;

 
    // ส่งคำสั่ง SQL เพื่อดึงข้อมูลโพสต์จากฐานข้อมูล
    const sql = `
    
SELECT board.*, market.*,hire.*
FROM board
JOIN market ON board.market_id = market.market_id 
JOIN user ON market.market_id = user.market_id
JOIN hire ON board.hire_id = hire.hire_id
AND market.market_id = ?
ORDER BY board.board_id DESC
LIMIT ? , ?

`;
    dbCon.query(sql,[yourMkId,offset, limitEx], function(err, results) {
        if (err) {
            console.error('Error querying MySQL database:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        const formattedResults = results.map(board => {
            return { ...board, board_date: formatDate2(board.board_date),board_rate:formatCurrency(board.board_rate)  };
        });
    
        res.json(formattedResults);
    });
});



router.post('/api/board_form', function(req, res) {
    const userId = req.session.userId;
    const content = req.body.boardContent;
    const trailer = req.body.trailer;
    const rate = req.body.rate;
    const type_rate = req.body.type_rate;
    

    

    const postTime = new Date();

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
        timeZone: 'Asia/Bangkok',
    };

    // Format postTime เป็น string
    const dateFormatter = new Intl.DateTimeFormat('en-US', options);
    const parts = dateFormatter.formatToParts(postTime);

    let formattedDate = '';
    let dateParts = {
        year: '',
        month: '',
        day: '',
        hour: '',
        minute: '',
        second: ''
    };

    parts.forEach(part => {
        if (part.type in dateParts) {
            dateParts[part.type] = part.value;
        }
    });

    formattedDate = `${dateParts.year}-${dateParts.month}-${dateParts.day} ${dateParts.hour}:${dateParts.minute}:${dateParts.second}`;

    let form_a = {
        post_time: formattedDate
    }

    console.log('------------>', formattedDate);

    if (req.files && req.files.postImage) {
        // ถ้ามีไฟล์ถูกอัปโหลด
        const uploadedFile = req.files.postImage;
        uploadPath = path.join('./API/img', uploadedFile.name);

        uploadedFile.mv(uploadPath, err => {
            if (err) return res.status(500).send(err);
            insertPostIntoDatabase();
        });
    } else {
        // ถ้าไม่มีไฟล์ถูกอัปโหลด, ใช้ภาพเริ่มต้น
        uploadPath = path.join('./API/img', '../img/PNG.png');
        insertPostIntoDatabase();
    }

    function insertPostIntoDatabase() {
        dbCon.query(`
        INSERT INTO board (board_date , board_trailer, board_discript,board_rate, hire_id,board_img,market_id)
        SELECT ? , ? , ? , ? ,? ,? ,user.market_id
        FROM user
        WHERE user.user_id = ?
            `, [form_a.post_time,trailer, content,rate,type_rate ,uploadPath, userId], (err, rows) => {

                res.redirect('/market/explore');

            });
    }
});


router.delete('/delete-board/:boardId', (req, res) => {
    const boardId = req.params.boardId;
    dbCon.query('DELETE FROM board WHERE board_id = ?', [boardId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("เกิดข้อผิดพลาดในการลบโพสต์");
        }
        res.status(200).send("โพสต์ถูกลบแล้ว");
    });
});



module.exports = router;