var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');

const sessionConfig = require('../middleware/session-config')

router.use(sessionConfig);
 
 
router.get('/api/posts', function(req, res) {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 5;
    const offset = page * limit;

 
    // ส่งคำสั่ง SQL เพื่อดึงข้อมูลโพสต์จากฐานข้อมูล
    const sql = `SELECT post.*, market.*
    FROM post 
    JOIN market ON post.market_id = market.market_id 
    ORDER BY post.post_id DESC
    LIMIT ?, ?
    
    `;
    dbCon.query(sql, [offset, limit], function(err, results) {
        if (err) {
            console.error('Error querying MySQL database:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});
 



router.post('/api/like', (req, res) => {
    const userId = req.session.userId;
    const  postId = req.query.postId;
    console.log('--->',req.session)

    // ตรวจสอบว่าผู้ใช้ได้ไลค์โพสต์นี้แล้วหรือไม่
    const checkLikedQuery = 'SELECT * FROM likes WHERE post_id = ? AND user_id = ?';
    dbCon.query(checkLikedQuery, [postId, userId], (err, result) => {
        if (err) throw err;

        let query;
        if (result.length > 0) {
            // ผู้ใช้ได้ไลค์แล้ว - ยกเลิกไลค์
            query = 'DELETE FROM likes WHERE post_id = ? AND user_id = ?';
        } else {
            // ผู้ใช้ยังไม่ได้ไลค์ - เพิ่มไลค์
            query = 'INSERT INTO likes (post_id, user_id) VALUES (?, ?)';
        }

        // ดำเนินการคำสั่ง SQL
        dbCon.query(query, [postId, userId], (err, result) => {
            if (err) throw err;

            // นับจำนวนไลค์ปัจจุบัน
            const countLikesQuery = 'SELECT COUNT(*) AS likeCount FROM likes WHERE post_id = ?';

            dbCon.query(countLikesQuery, postId, (err, result) => {
                res.json({ liked: result.length === 0, likeCount: result[0].likeCount });

                let from_a = {
                    post_id : postId,
                    likes:result[0].likeCount 
                }
                dbCon.query('UPDATE post SET likes = ? WHERE post_id = ?',[from_a.likes,from_a.post_id], (err, results) => {
                    if (err) throw err;
                });
                
            });
        });
    });
});

 
 
module.exports = router;