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

router.patch("/invite/:id", async (req, res) => {
  const { id } = req.params;
  const {
    not_attending_names,
    attending_names,
    special_requests,
    reply_method,
  } = req.body;

  try {
    const foundInvite = await Invite.findById(id);

    if (special_requests) {
      foundInvite.special_requests = special_requests;
    }
    if (attending_names) {
      foundInvite.attending_names = attending_names;
    }
    if (not_attending_names) {
      foundInvite.not_attending_names = not_attending_names;
    }
    if (reply_method) {
      foundInvite.reply_method = reply_method;
    }

    foundInvite.replied = true;

    await foundInvite.save();

    return res.status(200).send({ msg: "success" });
  } catch (e) {
    console.log("FAILED PATCHING GUEST!", e);
    return res.status(422).send({ msg: "failure" });
  }
});

router.get("/search", async (req, res) => {
  const { name } = req.query;
  console.log("NAME:", name);

  if (!name) return res.status(422).send({ error: "No name provided" });

  try {
    let results = await Invite.aggregate([
      {
        $search: {
          index: "default",
          autocomplete: {
            query: name,
            path: "invited_names",
            tokenOrder: "sequential",
          },
        },
      },
      {
        $project: {
          invite_label: 1,
          invited_names: 1,
          attending_names: 1,
          not_attending_names: 1,
          replied: 1,
          reply_method: 1,
          plus_one: 1,
          plus_one_attending: 1,
          special_requests: 1,
          _id: 1,
        },
      },
      // add sorting by match "score", somehow
      {
        $limit: 7,
      },
    ]);
    console.log("FOUND USERS:", results);

    if (results) {
      console.log("\nRESULTS:", results, "\n\n\n\n");
      return res.status(200).send(results);
    } else {
      return res.send([]);
    }
  } catch (e) {
    console.log("FAILED TO FIND USERS:", e);
    return res.status(404).send({ error: "Failed to find users" });
  }
});

module.exports = router;

// {
//   "mappings": {
//     "dynamic": false,
//     "fields": {
//       "username": [
//         {
//           "foldDiacritics": false,
//           "maxGrams": 7,
//           "minGrams": 3,
//           "tokenization": "edgeGram",
//           "type": "autocomplete"
//         }
//       ]
//     }
//   }
// }

// BACKUP
// try {
//   let results = await Invite.aggregate([
//     {
//       $search: {
//         index: "default",
//         autocomplete: {
//           query: name,
//           path: "username",
//           tokenOrder: "sequential",
//           fuzzy: {},
//         },
//       },
//     },
//     {
//       $project: {
//         username: 1,
//         avatar_image_url: 1,
//         _id: 1,
//       },
//     },
//     {
//       $limit: 5,
//     },
//   ]);
//   console.log("FOUND USERS:", results);

//   if (results) {
//     results = results.filter((result) => {
//       console.log("\n\nRESULT:", result, "\n");
//       let isBlockedByRequester =
//         user.blocked_ids.includes(result._id) ||
//         user.blocked_by_ids.includes(result._id);
//       return !isBlockedByRequester;
//     });
//     console.log("\nFILTERED RESULTS:", results, "\n\n\n\n");
//     return res.status(200).send(results);
//   } else {
//     return res.send([]);
//   }
// } catch (e) {
//   console.log("FAILED TO FIND USERS:", e);
//   return res.status(404).send({ error: "Failed to find users" });
// }
