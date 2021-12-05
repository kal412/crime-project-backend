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

/* UPDATE REPORT STATUS */
router.patch("/:reportId", async (req, res) => {
  let reportId = req.params.reportId;

  //Search record in database if any
  let report = await database.table("reports").filter({ id: reportId }).get();
  if (report) {
    let reportStatus = req.body.status;
    if (reportStatus === undefined || "") {
      res.status(422).json({ message: "Unprocessable identity or undefined" });
    } else {
      await database
        .table("reports")
        .filter({ id: reportId })
        .update({
          status: reportStatus,
        })
        .then((result) => res.json("Status updated succesfully"))
        .catch((err) => res.json(err));
    }
  }
});

module.exports = router;
