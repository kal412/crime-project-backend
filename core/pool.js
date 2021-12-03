const Mysqli = require("mysqli");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require("dotenv").config();

let conn = new Mysqli({
  Host: process.env.HOST,
  post: process.env.POST, //port,default 3306
  user: process.env.USERDB, //user
  passwd: process.env.PASSWORD, //password
  db: process.env.DATABASE,
});

let db = conn.emit(false, "");

module.exports = {
  database: db,
  validJWTNeeded: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.body.username = user;
      next();
    });
  },
  hasAuthFields: (req, res, next) => {
    let errors = [];

    if (req.body) {
      if (!req.body.username) {
        errors.push("Missing username field");
      }
      if (!req.body.password) {
        errors.push("Missing password fied");
      }

      if (errors.length) {
        return res.status(400).send({ errors: errors.join(",") });
      } else {
        return next();
      }
    } else {
      return res
        .status(400)
        .send({ errors: "Missing username and password fields" });
    }
  },
  isPasswordAndUserMatch: async (req, res, next) => {
    const myPlaintextPassword = req.body.password;
    const myUsername = req.body.username;

    const user = await db.table("users").filter({ username: myUsername }).get();
    if (user) {
      const match = await bcrypt.compare(myPlaintextPassword, user.password);

      if (match) {
        req.username = user.username;
        next();
      } else {
        res.status(401).send("Username or password incorrect");
      }
    } else {
      res.status(401).send("Username or password incorrect");
    }
  },
};
