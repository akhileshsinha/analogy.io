const User = require("../models/User");
const Topic = require("../models/Topic");

/**
 * period: daily | weekly | monthly | all
 * We’ll just filter by createdAt/updatedAt window for “recent activity”.
 */
function getDateFromPeriod(period) {
  const now = new Date();
  const d = new Date(now);
  if (period === "daily") d.setDate(now.getDate() - 1);
  else if (period === "weekly") d.setDate(now.getDate() - 7);
  else if (period === "monthly") d.setMonth(now.getMonth() - 1);
  else return null; // 'all'
  return d;
}

exports.userLeaderboard = async (req, res, next) => {
  try {
    const { period = "all", page = 1, limit = 10 } = req.query;
    const since = getDateFromPeriod(period);

    const match = {};
    if (since) match.updatedAt = { $gte: since };

    // Sort by stored popularityScore desc; fallback to upvotesReceived then responsesCount
    const items = await User.find(match)
      .sort({ popularityScore: -1, upvotesReceived: -1, responsesCount: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .select(
        "name email avatarUrl responsesCount upvotesReceived popularityScore updatedAt"
      )
      .lean();

    const total = await User.countDocuments(match);
    res.json({ page: Number(page), limit: Number(limit), total, items });
  } catch (err) {
    next(err);
  }
};

exports.topicLeaderboard = async (req, res, next) => {
  try {
    const { period = "all", page = 1, limit = 10, category } = req.query;
    const since = getDateFromPeriod(period);

    const match = {};
    if (category) match.category = category;
    if (since) match.updatedAt = { $gte: since };

    const items = await Topic.find(match)
      .sort({ popularityScore: -1, upvotesCount: -1, responsesCount: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .select(
        "title category responsesCount upvotesCount popularityScore updatedAt"
      )
      .lean();

    const total = await Topic.countDocuments(match);
    res.json({ page: Number(page), limit: Number(limit), total, items });
  } catch (err) {
    next(err);
  }
};
