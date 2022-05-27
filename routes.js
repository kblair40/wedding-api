const express = require("express");

const router = express.Router();

router.post("/guest", async (req, res) => {
  //
  const { body } = req;
  console.log("\n\nBODY:", body, "\n\n");
  return res.status(200).send({ msg: "success" });
});

router.get("/guest", async (req, res) => {
  try {
    console.log("SENDING:", url);
    res.status(200).send({ msg: "success" });
  } catch (err) {
    console.log("ERROR WITH S3:", err);
    res.status(422).send({ msg: "failure" });
  }
});

module.exports = router;
