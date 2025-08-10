const router = require("express").Router();

router.get("/", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

module.exports = router;
