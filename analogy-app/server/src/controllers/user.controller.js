const User = require("../models/User");

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, avatarUrl } = req.body;
    if (!name || !email)
      return res.status(400).json({ error: "name and email required" });
    const user = await User.create({ name, email, avatarUrl });
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ error: "email already exists" });
    next(err);
  }
};
