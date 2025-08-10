// Simple time-decay popularity helpers.
// Adjust weights to taste.

function daysSince(date) {
  const now = Date.now();
  return Math.max(0, (now - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Topic popularity = (responses*2) + (upvotes*3) + recentBoost
 * recentBoost decays over ~7 days
 */
function topicPopularity(t) {
  const ageDays = daysSince(t.createdAt || t.updatedAt || Date.now());
  const recentBoost = Math.round(10 * Math.exp(-ageDays / 7));
  return (t.responsesCount || 0) * 2 + (t.upvotesCount || 0) * 3 + recentBoost;
}

/**
 * User score for leaderboard = (responses*2) + (upvotesReceived*3) + recentBoost
 */
function userScore(u) {
  const ageDays = daysSince(u.updatedAt || u.createdAt || Date.now());
  const recentBoost = Math.round(10 * Math.exp(-ageDays / 7));
  return (
    (u.responsesCount || 0) * 2 + (u.upvotesReceived || 0) * 3 + recentBoost
  );
}

module.exports = { topicPopularity, userScore };
