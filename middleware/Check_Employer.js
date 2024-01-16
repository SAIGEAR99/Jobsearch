// middleware.js
function Check_Employer(req, res, next) {
    // Check if the user is logged in
    if (req.session && req.session.isEmployer && req.session.isLoggedIn ) {
       
        console.log('=====XXXX+++ log EmYer : ' ,req.session.isEmployer);
        next();
    } else {
        res.redirect('/login');
    }
}

module.exports = Check_Employer;