const jwt = require('jsonwebtoken');
const authConfig = require("../config/auth-config");

module.exports = (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    const decodedToken = jwt.verify(token, authConfig.secret);

    if (req.body.email && req.body.email !== decodedToken.email) {
      throw 'Unauthorized user!';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};