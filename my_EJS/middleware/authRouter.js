// authRouter.js
const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    if (!req.session.isLoggedIn) {
        const user = req.session.user || "";
        const password = req.session.password || "";
        return res.render('user/login', { user, password });
    }
    next();
});

module.exports = router;
