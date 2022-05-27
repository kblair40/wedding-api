const express = require("express");

const router = express.Router();

router.get("/guest", async (req, res) => {
  try {
    console.log("SENDING:", url);
    res.send({ msg: "success" });
  } catch (err) {
    console.log("ERROR WITH S3:", err);
    res.send({ msg: "success" });
  }
});

module.exports = router;
