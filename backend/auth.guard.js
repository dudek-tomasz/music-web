const authService = require('./auth.service');

module.exports = async function (req, res, next) {
    try {
        const isTokenOk = await authService.checkToken(req);

        if(isTokenOk) {
            return next();
        } else {
            console.log("Invalid token");
            res.status(404).json({message: "Invalid token"});
        }
    } catch (err) {
        res.status(404).json({message: "Invalid token", err: err.message});
    }
};
