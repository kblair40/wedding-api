const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
      unique: true,
    },
    other_family: [String],
    age_range: String,
    attending: Boolean,
    replied: Boolean,
    dinner_selection: String,
    dinner_selection_notes: String,
    email: String,
    phone_number: String,
    plus_one: String,
    side: String,
    significant_other: String,
    special_requests: String,
  },
  { timestamps: true }
);

mongoose.model("Guest", guestSchema);
