const Topic = require("../models/Topic");
const User = require("../models/User");
const { topicPopularity, userScore } = require("../utils/popularity");

function assertAdmin(req, res) {
  const token = req.header("x-admin-token");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

exports.recomputePopularity = async (req, res, next) => {
  if (!assertAdmin(req, res)) return;

  try {
    const [topics, users] = await Promise.all([
      Topic.find()
        .select("_id responsesCount upvotesCount createdAt updatedAt")
        .lean(),
      User.find()
        .select("_id responsesCount upvotesReceived createdAt updatedAt")
        .lean(),
    ]);

    const topicOps = topics.map((t) => ({
      updateOne: {
        filter: { _id: t._id },
        update: { $set: { popularityScore: topicPopularity(t) } },
      },
    }));
    const userOps = users.map((u) => ({
      updateOne: {
        filter: { _id: u._id },
        update: { $set: { popularityScore: userScore(u) } },
      },
    }));

    if (topicOps.length) await Topic.bulkWrite(topicOps);
    if (userOps.length) await User.bulkWrite(userOps);

    res.json({
      ok: true,
      topicsUpdated: topicOps.length,
      usersUpdated: userOps.length,
    });
  } catch (err) {
    next(err);
  }
};
