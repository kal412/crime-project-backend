const express = require("express");
const { check, validationResult, body } = require("express-validator");
const router = express.Router();
const core = require("../core/pool");
const { database } = require("../core/pool");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require("dotenv").config();

// REFRESH TOKEN ROUTE
router.post("/refresh", async (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  const token = await database
    .table("tokens")
    .filter({ token: refreshToken })
    .get();
  if (!token.token) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.body.username = user;
    const accessToken = generateAccessToken(user);
    res.json({ accessToken: accessToken });
  });
});

// LOGIN ROUTE
router.post(
  "/signin",
  [core.hasAuthFields, core.isPasswordAndUserMatch],
  async (req, res) => {
    const username = req.body.username;
    const accessToken = generateAccessToken(username);
    const refreshToken = jwt.sign(username, process.env.REFRESH_TOKEN_SECRET);
    await database
      .table("tokens")
      .insert({
        token: refreshToken,
      })
      .catch((err) => res.status(433).json({ err: err }));

    const user = await database
      .table("users")
      .filter({ username: req.body.username })
      .get();
    res.json({
      token: accessToken,
      refreshToken: refreshToken,
      auth: true,
      username: req.body.username,
      id: user.id,
    });
  }
);

// FUNCTION TO GENERATE ACCESS TOKEN
function generateAccessToken(username) {
  return jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15s",
  });
}

// LOGOUT ROUTE
router.delete("/logout", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const deleteToken = await core.database
    .table("tokens")
    .filter({ token: token })
    .get();
  if (deleteToken) {
    await core.database
      .table("tokens")
      .filter({ id: deleteToken.id })
      .remove()
      .then(res.status(200).json({ message: "Deleted successfully" }))
      .catch((err) => res.status(433).json({ err: err }));
  }
});

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
        .then(res.status(200).json({ message: "Registered successfully" }))
        .catch((err) => res.status(433).json({ err: err }));
    }
  }
);

module.exports = router;
