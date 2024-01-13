//red_a.js
const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    // ตรวจสอบว่ามี session และ isLoggedIn เป็น true หรือไม่
    if (req.session && req.session.isLoggedIn) {
        // ถ้ามี session และ isLoggedIn เป็น true ให้ทำการ redirect ไปที่หน้าหลัก
        return res.redirect('/user');
    }
    
    // ถ้าไม่มี session หรือ isLoggedIn เป็น false ให้ทำตามขั้นตอนด้านล่าง
    const user = req.session.user || "";
    const password = req.session.password || "";

    // ทำการ next() เพื่อผ่าน middleware ไปยังตัวถัดไป
    next();
});

module.exports = router;

