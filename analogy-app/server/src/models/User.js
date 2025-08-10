const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatarUrl: String,
    // simple stats for leaderboard later
    responsesCount: { type: Number, default: 0 },
    upvotesReceived: { type: Number, default: 0 },
    popularityScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

module.exports = model("User", userSchema);
