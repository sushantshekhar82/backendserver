var jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (token) {
    const decode = jwt.verify(token, "masai");
    // console.log(decode);
    if (decode) {
      req.body.userId = decode.userId;
      next();
    } else {
      res.status(400).send("login first");
    }
  } else {
    res.status(400).send("login first");
  }
};
module.exports = { auth };
