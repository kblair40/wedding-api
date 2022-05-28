const express = require("express");
const mongoose = require("mongoose");
const aliasMap = require("./constants");
const Guest = mongoose.model("Guest");
console.log("ALIAS MAP:", aliasMap);
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

const hasOtherFamily = (guest) =>
  Boolean(guest && guest.other_family && guest.other_family.length);

const hasSO = (guest) => Boolean(guest && guest.significant_other);

router.get("/guest/byname", async (req, res) => {
  // console.log("\nREQ:", req);
  const { full_name } = req.query;
  console.log("FULL NAME:", full_name);

  let mainGuest = await findGuest(full_name);
  if (!mainGuest) {
    return res.status(404).send({ msg: "not found" });
  } else {
    return res.status(200).send(mainGuest);
  }
});

const findGuest = async (full_name) => {
  let foundGuest;
  try {
    foundGuest = await Guest.findOne({ full_name });
    console.log("FOUND GUEST:", foundGuest);

    if (foundGuest) {
      return foundGuest;
    } else {
      const alias = aliasMap[full_name];
      if (!alias) {
        return null;
      }

      try {
        foundGuest = await Guest.findOne({ full_name: alias });
        console.log("FOUND GUEST:", foundGuest);

        return foundGuest ? foundGuest : null;
      } catch (e) {
        // also unable to find using alias
        return null;
      }
    }
  } catch (e) {
    console.log("ERROR WHILE FETCHING GUEST:", e);
  }
  return null;
};

module.exports = router;
