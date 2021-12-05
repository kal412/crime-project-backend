const express = require("express");
const router = express.Router();
const { database } = require("../core/pool");
const core = require("../core/pool");

/* GET ALL REPORTS */
router.get("/", async (req, res) => {
  await database
    .table("reports as r")
    .join([
      {
        table: "users as u",
        on: "r.user_id = u.id",
      },
    ])
    .withFields([
      "r.id",
      "r.crime_type",
      "r.description",
      "r.reported_at",
      "r.status",
      "u.username",
    ])
    .getAll()
    .then((reports) => {
      if (reports.length > 0) {
        res.json(reports);
      } else {
        res.json({ message: "No reports found" });
      }
    })
    .catch((err) => res.json(err));
});

/* GET REPORT BY SEARCH */
router.get("/:search", [core.validJWTNeeded], async (req, res) => {
  let reportUserName = req.params.search;
  let reportCrimeType = req.params.search;
  let reportDate = req.params.search;
  console.log(reportUserName);
  await database
    .table("reports as r")
    .join([
      {
        table: "users as u",
        on: "r.user_id = u.id",
      },
    ])
    .withFields([
      "r.id",
      "r.crime_type",
      "r.description",
      "r.reported_at",
      "r.status",
      "u.id",
      "u.username",
    ])
    .filter({
      $or: [
        { "u.username": reportUserName },
        { "r.crime_type": reportCrimeType },
        { "r.reported_at": reportDate },
      ],
    })
    .getAll()
    .then((reports) => {
      console.log(reports);
      if (reports.length > 0) {
        res.json(reports);
      } else {
        res.json({ message: "No reports found" });
      }
    })
    .catch((err) => res.json(err));
});

module.exports = router;
