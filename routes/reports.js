const express = require("express");
const router = express.Router();
const { database } = require("../core/pool");
const core = require("../core/pool");

/* ADD NEW REPORT */
router.post("/new", [core.validJWTNeeded], async (req, res) => {
  let crimeType = req.body.crime_type;
  let description = req.body.description;
  let reportedAt = req.body.reported_at;
  let userId = req.body.user_id;

  await database
    .table("reports")
    .insert({
      crime_type: crimeType,
      description: description,
      reported_at: reportedAt,
      user_id: userId,
    })
    .then(res.status(200).json({ message: "Report registered successfully" }))
    .catch((err) => res.status(433).json({ err: err }));
});

module.exports = router;
