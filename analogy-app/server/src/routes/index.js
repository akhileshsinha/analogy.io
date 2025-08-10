const router = require("express").Router();
const user = require("../controllers/user.controller");
const topic = require("../controllers/topic.controller");
const leaderboard = require("../controllers/leaderboard.controller");
const admin = require("../controllers/admin.controller");

// users (dev helper)
router.post("/users", user.createUser);

// topics
router.get("/topics", topic.listTopics);
router.post("/topics", topic.createTopic);
router.get("/topics/:id", topic.getTopic);
router.post("/topics/:id/upvote", topic.upvoteTopic);

// responses
router.get("/topics/:id/responses", topic.listResponses);
router.post("/topics/:id/responses", topic.createResponse);
router.post("/responses/:id/upvote", topic.upvoteResponse);

// leaderboard
router.get("/leaderboard/users", leaderboard.userLeaderboard);
router.get("/leaderboard/topics", leaderboard.topicLeaderboard);

// admin
router.post("/admin/recompute-popularity", admin.recomputePopularity);

module.exports = router;
