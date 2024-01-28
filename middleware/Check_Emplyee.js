// Check_Employer.js
function Check_Employee(req, res, next) {
    // Check if the user is logged in
    if (req.session && req.session.isEmployee ) {
        console.log('=====XXXX+++ log EmYee : ' ,req.session.isEmployee);
        next();
    } else {
        res.redirect('/market/feed');
    }
}

module.exports = Check_Employee;