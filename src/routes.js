const express = require("express");
const mongoose = require("mongoose");
const aliasMap = require("./constants");
const Invite = mongoose.model("Invite");
console.log("ALIAS MAP:", aliasMap);
const router = express.Router();

router.post("/guest", async (req, res) => {
  const { body } = req;
  console.log("\n\nBODY:", body, "\n\n");
  // body = JSON.parse(body);

  body.replied = false;

  try {
    const guest = new Invite(body);
    await guest.save();

    // console.log("\n\nBODY:", body, "\n\n");
    return res.status(200).send({ msg: "success" });
  } catch (e) {
    console.log("UNABLE TO SAVE:", e);
    return res.status(422).send({ msg: "failure" });
  }
});

// GET ALL GUESTS
router.get("/invites", async (req, res) => {
  try {
    // console.log("SENDING:", url);
    const invites = await Invite.find({});
    return res.status(200).send(invites);
  } catch (err) {
    console.log("\n\nERROR GETTING ALL Invites:", err);
    return res.status(422).send([]);
  }
});

// router.get("/guest/byname", async (req, res) => {
//   const { full_name } = req.query;
//   console.log("FULL NAME:", full_name, "\n");

//   let mainGuest = await findGuest(full_name);

//   if (!mainGuest) {
//     return res.status(404).send({ msg: "not found" });
//   }

//   let family = [];
//   if (hasOtherFamily(mainGuest)) {
//     const { other_family } = mainGuest;
//     console.log("OTHER FAMILY:", other_family);

//     for (let name of other_family) {
//       let guest = await findGuest(name);
//       if (guest) family.push(guest);
//     }
//     console.log("\nFAMILY AFTER:", family, "\n");
//   }

//   let so;
//   if (hasSO(mainGuest)) {
//     const { significant_other } = mainGuest;
//     // console.log("SIGNIFICANT OTHER:", significant_other);

//     so = await findGuest(significant_other);
//   }

//   console.log("\n\nRETURNING:", { mainGuest, family, so });
//   return res.status(200).send({ mainGuest, family, so });
// });

// const findGuest = async (full_name) => {
//   let foundGuest;
//   try {
//     foundGuest = await Guest.findOne({ full_name });
//     console.log("FOUND GUEST:", foundGuest);

//     if (foundGuest) {
//       return foundGuest;
//     } else {
//       const alias = aliasMap[full_name];
//       if (!alias) {
//         return null;
//       }

//       try {
//         foundGuest = await Guest.findOne({ full_name: alias });
//         console.log("FOUND GUEST:", foundGuest);

//         return foundGuest ? foundGuest : null;
//       } catch (e) {
//         // also unable to find using alias
//         return null;
//       }
//     }
//   } catch (e) {
//     console.log("ERROR WHILE FETCHING GUEST:", e);
//   }
//   return null;
// };

// router.patch("/guest/:id", async (req, res) => {
//   const { id } = req.params;
//   const {
//     special_requests,
//     dinner_selection,
//     dinner_selection_notes,
//     attending,
//   } = req.body;

//   try {
//     const foundGuest = await Guest.findById(id);

//     foundGuest.special_requests = special_requests;
//     foundGuest.dinner_selection = dinner_selection;
//     foundGuest.dinner_selection_notes = dinner_selection_notes;
//     foundGuest.attending = attending;
//     foundGuest.replied = true;

//     await foundGuest.save();

//     return res.status(200).send({ msg: "success" });
//   } catch (e) {
//     console.log("FAILED PATCHING GUEST!", e);
//     return res.status(422).send({ msg: "failure" });
//   }
// });

module.exports = router;
