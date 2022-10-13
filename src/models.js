const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema(
  {
    invited_names: {
      type: [String],
      required: true,
    },
    attending_names: [String],
    not_attending_names: [String],
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
