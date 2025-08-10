require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const serveStatic = require("serve-static");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const healthRouter = require("./routes/health");
const devUser = require("./middlewares/devUser");
const apiRouter = require("./routes");

const app = express();
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

app.use(helmet());
app.use(compression());
app.use(rateLimit({ windowMs: 5 * 60 * 1000, max: 300 })); // 300 req / 5 min per IP

const corsOrigin = process.env.NODE_ENV === "production" ? false : true; // disable in prod for same-origin
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: "1mb" }));
const swaggerDoc = YAML.load(path.join(__dirname, "..", "openapi.yaml"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use(morgan("dev"));
app.use(devUser);

app.use("/api", apiRouter);
app.use("/health", healthRouter);

// Serve React build only in production
if (process.env.NODE_ENV === "production") {
  const CLIENT_DIST = path.join(__dirname, "..", "..", "client", "dist");

  app.use(serveStatic(CLIENT_DIST));

  // Fallback to index.html for all non-/api routes
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(CLIENT_DIST, "index.html"));
  });
}

app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Simple root route
app.get("/", (_req, res) => {
  res.json({ ok: true });
});

module.exports = app;
