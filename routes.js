const express = require("express");
const mongoose = require("mongoose");

const Guest = mongoose.model("Guest");

const router = express.Router();

router.post("/guest", async (req, res) => {
  const { body } = req;
  console.log("\n\nBODY:", body, "\n\n");

  body.replied = false;

  try {
    const guest = new Guest(body);
    await guest.save();

    // console.log("\n\nBODY:", body, "\n\n");
    return res.status(200).send({ msg: "success" });
  } catch (e) {
    console.log("UNABLE TO SAVE:", e);
    return res.status(422).send({ msg: "failure" });
  }
});

// GET ALL GUESTS
router.get("/guest", async (req, res) => {
  try {
    // console.log("SENDING:", url);
    const guests = await Guest.find({});
    return res.status(200).send(guests);
  } catch (err) {
    console.log("\n\nERROR GETTING ALL GUESTS:", err);
    res.status(422).send({ msg: "failure" });
  }
});

module.exports = router;
