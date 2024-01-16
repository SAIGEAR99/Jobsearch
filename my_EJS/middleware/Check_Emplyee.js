// middleware.js
function Check_Employee(req, res, next) {
    // Check if the user is logged in
    if (req.session && req.session.isEmployee && req.session.isLoggedIn) {
        console.log('=====XXXX+++ log EmYee : ' ,req.session.isEmployee);
        next();
    } else {
        res.redirect('/login');
    }
}

module.exports = Check_Employee;