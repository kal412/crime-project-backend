const express = require("express");
const router = express.Router();
const { database } = require("../core/pool");

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

/* GET ONE USER MATCHING ID */
router.get("/:userId", (req, res) => {
  let userId = req.params.userId;
  database
    .table("users")
    .filter({ id: userId })
    .get()
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.json({ message: `NO USER FOUND WITH ID: ${userId}` });
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
    let userPassword = req.body.password;

    //Replace the user's information with the form data
    database
      .table("users")
      .filter({ id: userId })
      .update({
        password: userPassword !== undefined ? userPassword : user.password,
      })
      .then((result) => res.json("Password updated succesfully"))
      .catch((err) => res.json(err));
  }
});

module.exports = router;
