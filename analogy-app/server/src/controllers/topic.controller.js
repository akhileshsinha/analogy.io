const Topic = require("../models/Topic");
const Response = require("../models/Response");
const { Types } = require("mongoose");

exports.listTopics = async (req, res, next) => {
  try {
    const {
      q,
      category,
      sort = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
      from,
      to,
    } = req.query;

    const match = {};
    if (category) match.category = category;
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }
    const { purposes } = req.query;
    if (purposes) {
      // expect comma-separated purposes: ?purposes=teaching,interview-prep
      const arr = String(purposes)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (arr.length) match.purposes = { $in: arr };
    }
    if (q) {
      match.$text = { $search: q };
    }

    const sortObj = {};
    const dir = order === "asc" ? 1 : -1;
    if (["createdAt", "popularityScore", "responsesCount"].includes(sort)) {
      sortObj[sort] = dir;
    } else {
      sortObj.createdAt = -1;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Topic.find(match)
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit))
        .select(
          "title category responsesCount popularityScore createdAt imageUrl"
        )
        .lean(),
      Topic.countDocuments(match),
    ]);

    res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      items,
    });
  } catch (err) {
    next(err);
  }
};

exports.createTopic = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.body.createdBy; // fallback for now
    if (!userId)
      return res
        .status(401)
        .json({ error: "x-user-id header or createdBy required" });

    const { title, description = "", category = "", purposes = [] } = req.body;
    if (!title) return res.status(400).json({ error: "title is required" });

    const topic = await Topic.create({
      title,
      description,
      category,
      purposes,
      createdBy: userId,
    });
    res.status(201).json(topic);
  } catch (err) {
    next(err);
  }
};

exports.getTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.id).lean();
    if (!topic) return res.status(404).json({ error: "Topic not found" });
    res.json(topic);
  } catch (err) {
    next(err);
  }
};

exports.upvoteTopic = async (req, res, next) => {
  try {
    const t = await Topic.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotesCount: 1 } },
      { new: true }
    ).lean();
    if (!t) return res.status(404).json({ error: "Topic not found" });
    res.json(t);
  } catch (err) {
    next(err);
  }
};

exports.listResponses = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
    } = req.query;
    const sortObj = {};
    const dir = order === "asc" ? 1 : -1;
    sortObj[sort === "upvotesCount" ? "upvotesCount" : "createdAt"] = dir;

    const skip = (Number(page) - 1) * Number(limit);
    const topicId = req.params.id;
    if (!Types.ObjectId.isValid(topicId))
      return res.status(400).json({ error: "bad topic id" });

    const [items, total] = await Promise.all([
      Response.find({ topicId })
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Response.countDocuments({ topicId }),
    ]);

    res.json({ page: Number(page), limit: Number(limit), total, items });
  } catch (err) {
    next(err);
  }
};

exports.createResponse = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.body.createdBy;
    if (!userId)
      return res
        .status(401)
        .json({ error: "x-user-id header or createdBy required" });

    const topicId = req.params.id;
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "content is required" });

    const resp = await Response.create({ topicId, content, createdBy: userId });
    // bump counters
    await Promise.all([
      // Topic responsesCount++
      require("../models/Topic").updateOne(
        { _id: topicId },
        { $inc: { responsesCount: 1 } }
      ),
      // User responsesCount++ (optional)
      require("../models/User").updateOne(
        { _id: userId },
        { $inc: { responsesCount: 1 } }
      ),
    ]);

    res.status(201).json(resp);
  } catch (err) {
    next(err);
  }
};

exports.upvoteResponse = async (req, res, next) => {
  try {
    const r = await require("../models/Response")
      .findByIdAndUpdate(
        req.params.id,
        { $inc: { upvotesCount: 1 } },
        { new: true }
      )
      .lean();
    if (!r) return res.status(404).json({ error: "Response not found" });
    // credit the author (simple stat)
    await require("../models/User").updateOne(
      { _id: r.createdBy },
      { $inc: { upvotesReceived: 1 } }
    );
    res.json(r);
  } catch (err) {
    next(err);
  }
};
