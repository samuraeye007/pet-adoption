// middlewares/authMiddlewares.js
const jwt = require('jsonwebtoken');

function authenticateUser(secretKey) {
  return (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }

      req.user = user;
      next();
    });
  };
}

module.exports = authenticateUser;
