const User = require("../models/User");

// Dev-only: if x-user-id is present, attach req.user
module.exports = async function devUser(req, _res, next) {
  const id = req.header("x-user-id");
  if (!id) return next();
  try {
    const user = await User.findById(id).lean();
    if (user) req.user = user;
  } catch (_e) {}
  next();
};
