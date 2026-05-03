const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, "secretkey");

    console.log("Decoded token:", decoded); 

    req.user = decoded; 

    next();
  } catch (err) {
    console.log("AUTH ERROR:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};