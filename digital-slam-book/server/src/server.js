import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import Admin from "./models/Admin.js";
import authRoutes from "./routes/authRoutes.js";
import slamRoutes from "./routes/slamRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, "..", "uploads");
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    }
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(uploadsPath));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Digital Slam Book" });
});

app.use("/api/auth", authRoutes);
app.use("/api/slam", slamRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);

  if (err.name === "MulterError") {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({ message: err.message || "Something went wrong." });
});

async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@slambook.local";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const existing = await Admin.findOne({ email });

  if (!existing) {
    const hashedPassword = await bcrypt.hash(password, 12);
    await Admin.create({ email, password: hashedPassword });
    console.log(`Admin user created: ${email}`);
  }
}

async function start() {
  await connectDB();
  await ensureAdmin();

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
