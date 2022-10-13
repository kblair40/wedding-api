const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema(
  {
    invite_label: String,
    invited_names: {
      type: [String],
      required: true,
    },
    attending_names: {
      type: [String],
      default: [],
    },
    not_attending_names: {
      type: [String],
      default: [],
    },
    replied: {
      type: Boolean,
      default: false,
    },
    reply_method: {
      type: String,
      enum: ["website", "email", ""],
    },
    email: String,
    plus_one: Boolean,
    plus_one_attending: Boolean,
    special_requests: String,
  },
  { timestamps: true }
);

mongoose.model("Invite", inviteSchema);
