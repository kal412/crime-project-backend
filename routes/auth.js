const express = require("express");
const { check, validationResult, body } = require("express-validator");
const router = express.Router();
const core = require("../core/pool");
const { database } = require("../core/pool");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require("dotenv").config();

// LOGIN ROUTE
router.post(
  "/signin",
  [core.hasAuthFields, core.isPasswordAndUserMatch],
  async (req, res) => {
    let token = jwt.sign(
      { state: true, username: req.body.username },
      process.env.ACCESS_TOKEN_SECRET,
      {
        algorithm: "HS512",
        expiresIn: "3h",
      }
    );
    const user = await database
      .table("users")
      .filter({ username: req.body.username })
      .get();
    res.json({
      token: token,
      auth: true,
      username: req.body.username,
      id: user.id,
    });
  }
);

// REGISTER ROUTE
router.post(
  "/register",
  [
    check("email")
      .isEmail()
      .not()
      .isEmpty()
      .withMessage("Field can't be empty")
      .normalizeEmail({ all_lowercase: true }),
    check("password")
      .escape()
      .trim()
      .not()
      .isEmpty()
      .withMessage("Field can't be empty")
      .isLength({ min: 8 })
      .withMessage("must be 8 characters long"),
    body("email").custom((value) => {
      return core.database
        .table("users")
        .filter({
          $or: [{ email: value }, { username: value }],
        })
        .get()
        .then((user) => {
          if (user) {
            console.log(user);
            return Promise.reject(
              "Email/ Username already exists, choose another one"
            );
          }
        });
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      let email = req.body.email;
      let username = req.body.username;
      let password = await bcrypt.hash(req.body.password, 10);
      let fname = req.body.fname;
      let lname = req.body.lname;

      core.database
        .table("users")
        .insert({
          username: username,
          password: password,
          email: email,
          role: 222,
          lname: lname || null,
          fname: fname || null,
        })
        .catch((err) => res.status(433).json({ err: err }));
    }
  }
);

module.exports = router;
