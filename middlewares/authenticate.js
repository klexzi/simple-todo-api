const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      jwt.verify(token, config.get("JWTSecret"));
      next();
    } catch (err) {
      res.status(401).send(`Authentication Failed : ${err.message}`);
    }
  } else res.status(401).send("Not Authorized to access");
};
