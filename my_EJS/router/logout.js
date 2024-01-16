// logout.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // ลบ session ทั้งหมด
    req.session = null;
    
    // ส่งผู้ใช้กลับไปที่หน้า Login
    res.redirect('/login');
});

module.exports = router;
