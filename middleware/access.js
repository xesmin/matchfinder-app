const exports = module.exports = {};

exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated())
        return next();

    res.redirect('/login');
};

exports.isLoggedOut = (req, res, next) => {
    if(req.isAuthenticated())
        res.redirect('back');

    return next();
};