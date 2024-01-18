//login.js
var express = require('express');
var router = express.Router();
let dbCon = require('../lib/db');
const checkAuth = require('../middleware/checkAuth');

const checkEmployer  = require('../middleware/Check_Employer');
const checkEmployee  = require('../middleware/Check_Emplyee');



router.get('/',(req, res) => {
    res.render('user/login', { user: "", password: "" });
});


// loginRoutes.js
router.post('/log', (req, res) => {
    const user = req.body.user;
    const password = req.body.password;

    if (!user || !password) {
        res.redirect('/login');
        return;
    }

    // Query the database
    dbCon.query('SELECT * FROM user WHERE username = ? AND password = ?', [user, password], (err, rows) => {
        
        if (err) {
            console.error(err);
            res.redirect('/login');
            return;
        }

        if (rows.length > 0) {
            // Set session variables
            req.session.user = user;
            req.session.password = password;
          

            // Check the role
            if (rows[0].role === 1) {
                req.session.isLoggedIn = true;
                req.session.isAdmin = true;
                res.redirect('/admin');
            } else if (rows[0].role === 2 ) {
                req.session.isEmployer = true;
                res.render('employer/ep_y_re',{ user_B : user});
                 // Redirect to employer route
            } else if (rows[0].role === 3) {
                req.session.isEmployee = true;
                res.render('employee/ep_e_re',{ user_A : user}); 
                // Redirect to employee route
            } else {
                res.redirect('/login'); // Role does not match
            }
        } else {
            res.redirect('/login'); // User not found
        }
    });
});

router.use(checkAuth);
router.use(checkEmployer);
router.use(checkEmployee);


module.exports = router;