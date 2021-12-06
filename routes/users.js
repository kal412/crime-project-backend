const express = require("express");
const router = express.Router();
const { database } = require("../core/pool");
const bcrypt = require("bcrypt");

/* GET USERS LISTING */
router.get("/", (req, res) => {
  database
    .table("users")
    .withFields([
      "username",
      "password",
      "email",
      "fname",
      "lname",
      "role",
      "id",
    ])
    .getAll()
    .then((list) => {
      if (list.length > 0) {
        res.json({ users: list });
      } else {
        res.json({ message: "NO USER FOUND" });
      }
    })
    .catch((err) => res.json(err));
});

/* GET ONE USER MATCHING EMAIL */
router.get("/:userEmail", (req, res) => {
  let userEmail = req.params.userEmail;
  database
    .table("users")
    .filter({ email: userEmail })
    .get()
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res
          .status(404)
          .json({ message: `NO USER FOUND WITH ID: ${userEmail}` });
      }
    })
    .catch((err) => res.json(err));
});

/* UPDATE USER PASSWORD */
router.patch("/:userId", async (req, res) => {
  let userId = req.params.userId;

  //Search user in database if any
  let user = await database.table("users").filter({ id: userId }).get();
  if (user) {
    let userPassword = await bcrypt.hash(req.body.password, 10);

    if (userPassword === undefined || "") {
      res.status(422).json({ message: "Unprocessable identity or undefined" });
    } else {
      database
        .table("users")
        .filter({ id: user.id })
        .update({
          password: userPassword,
        })
        .then((result) => res.json("Password updated succesfully"))
        .catch((err) => res.json(err));
    }
  }
});

module.exports = router;
