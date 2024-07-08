const jwtToken = require("jsonwebtoken");
require("dotenv").config();

module.exports.Auth = async function Auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) return res.status(401).send("Access Denied / Unauthorized request");

        const token = authHeader.split(' ')[1];

        const decoded = jwtToken.verify(token, process.env.privateKey); 
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(400).json("Authentication Failed: " + e.message);
    }
};
