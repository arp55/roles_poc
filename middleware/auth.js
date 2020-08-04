const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function auth(req, res, next) {
    try {
        let token = req.headers.token;
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.token = decoded
        console.log('decode', decoded);
        if (req.route.path == '/createRole') {
            if (decoded.role != "admin") {
                console.log("object")
                return res.status(401).send("Authorition required!");
            } else {
                next();
            }
        }
        else if (req.route.path == '/createUser') {
            if (decoded.role == "admin") {
                if (req.headers.role != "admin") {
                    next();
                }
                else {
                    return res.status(400).send("Unauthorized request!");
                }
            }
            else if (decoded.role == "brandadmin") {
                if (req.headers.role == "admin" || req.headers.role == "brandadmin") {
                    return res.status(401).send("You are not authorized!");
                }
                else {
                    next();
                }
            }
            else if (decoded.role == "brandmanager") {
                if (req.headers.role != "brandwaiter") {
                    return res.status(401).send("You are not authorized!");
                }
                else {
                    next();
                }
            }
            else if (decoded.role == "brandwaiter") {
                return res.status(401).send("You are not authorized!");
            }
            else {
                return res.status(401).send("Authorition required!");
            }
        }
    }
    catch (ex) {
        return res.status(400).send("Invalid token.")
    }
}