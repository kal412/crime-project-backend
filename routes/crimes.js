const express = require("express");
const router = express.Router();
const { database } = require("../core/pool");

/* GET ALL CRIME TYPES */
router.get("/", (req, res) => {
  database
    .table("crimes as c")
    .withFields(["c.id", "c.type"])
    .getAll()
    .then((crimes) => {
      if (crimes.length > 0) {
        res.json(crimes);
      } else {
        res.json({ message: "No crime types found" });
      }
    })
    .catch((err) => res.json(err));
});

module.exports = router;
