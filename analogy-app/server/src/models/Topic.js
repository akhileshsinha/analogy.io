const { Schema, model, Types } = require("mongoose");

const topicSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, index: true },
    purposes: [{ type: String }],
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    responsesCount: { type: Number, default: 0 },
    upvotesCount: { type: Number, default: 0 },
    popularityScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

topicSchema.index({ category: 1, createdAt: -1 });
topicSchema.index({ createdAt: -1 });
topicSchema.index({ title: "text", description: "text" });

module.exports = model("Topic", topicSchema);
