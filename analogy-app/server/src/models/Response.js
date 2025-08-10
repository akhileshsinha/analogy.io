const { Schema, model, Types } = require("mongoose");

const responseSchema = new Schema(
  {
    topicId: {
      type: Types.ObjectId,
      ref: "Topic",
      required: true,
      index: true,
    },
    content: { type: String, required: true, trim: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    upvotesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

responseSchema.index({ topicId: 1, createdAt: -1 });
responseSchema.index({ content: "text" });

module.exports = model("Response", responseSchema);
