const jwt = require("jsonwebtoken");
const HttpException = require('../utils/HttpException.utils');
const JWT_KEY = process.env.JWT_KEY;
const MASTER_KEY = process.env.MASTER_KEY;

const verifyUser = (req, res, next) => {
    // const token = req.header("auth-token");
    // if (!token) return res.status(400).send("access denied");

    const authHeader = req.headers.authorization;
    const bearer = 'Bearer ';

    if (!authHeader || !authHeader.startsWith(bearer)) {
        throw new HttpException(401, 'Access denied. No credentials sent!');
    }

    const token = authHeader.replace(bearer, '');
    const secretKey = process.env.JWT_KEY || "";
    try {
      const verifiedUser = jwt.verify(token, JWT_KEY);
      req.user = verifiedUser;
      next();
    } catch (err) {
      res.status(400).send("invalid token");
    }
};



module.exports = { verifyUser }