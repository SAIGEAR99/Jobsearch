// Middleware สำหรับตรวจสอบสิทธิ์ admin
const express = require('express');
const router = express.Router();

function checkAdminRights(req, res, next) {
    // ตรวจสอบว่า session มีอยู่หรือไม่
    if (req.session && req.session.isAdmin) {
        // ผู้ใช้มีสิทธิ์ admin
        next(); // ไปยัง middleware ถัดไป
    } else {
        // ถ้าไม่มี session หรือไม่มีสิทธิ์ admin, redirect หรือทำตามที่คุณต้องการ
        res.redirect('/login'); // หรือ res.render('login'); หรือหน้าอื่น ๆ
    }
}

module.exports = router;
