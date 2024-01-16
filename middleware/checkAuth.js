// checkAuth middleware
function checkAuth(req, res, next) {
    if (req.session && req.session.isLoggedIn && req.session.isAdmin) {
        // If logged in and isAdmin, proceed to the next middleware or route
        next();
    } else {
        // If not logged in or not an admin, redirect to the login page
        res.redirect('/login');
    }
}

module.exports = checkAuth;

