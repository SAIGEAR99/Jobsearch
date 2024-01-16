//hone.js

const express = require('express');
const router = express.Router();
const dbConnection = require('../lib/db');

router.get('/', async (req, res) => {
    try {
        const [rows, fields] = await dbConnection.execute('SELECT * FROM login WHERE login_id = ?', [req.session.userId]);
        const userData = rows[0];

        res.render('user/home', { userData: userData });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
