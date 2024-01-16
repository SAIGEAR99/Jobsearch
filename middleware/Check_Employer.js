// Check_Employer.js
function Check_Employer(req, res, next) {
    // Check if the user is logged in
    if (req.session && req.session.isEmployer) {
       
        console.log('=====XXXX+++ log EmYer : ' ,req.session.isEmployer);
        next();
    } else {
        res.redirect('/home');
    }
}

module.exports = Check_Employer;