import fs from "fs";
import path from "path";
import express from "express";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";
import SlamEntry from "../models/SlamEntry.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.join(__dirname, "..", "..");

function clean(value = "") {
  return String(value).trim();
}

function validateEntry(body) {
  const name = clean(body.name);
  const collegeName = clean(body.collegeName);
  const batchYear = clean(body.batchYear);
  const department = clean(body.department);

  if (!name) return "Name is required.";
  if (name.length < 2) return "Name must be at least 2 characters.";
  if (name.length > 80) return "Name must be 80 characters or less.";
  if (!collegeName) return "College name is required.";
  if (!batchYear) return "Batch or passout year is required.";
  if (!department) return "Department or course is required.";

  return null;
}

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    const validationError = validateEntry(req.body);

    if (validationError) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: validationError });
    }

    const entry = await SlamEntry.create({
      name: clean(req.body.name),
      nickname: clean(req.body.nickname),
      collegeName: clean(req.body.collegeName),
      batchYear: clean(req.body.batchYear),
      department: clean(req.body.department),
      rollNumber: clean(req.body.rollNumber),
      currentStatus: clean(req.body.currentStatus),
      currentCity: clean(req.body.currentCity),
      socialLink: clean(req.body.socialLink),
      memory: clean(req.body.memory),
      message: clean(req.body.message),
      futureGoals: clean(req.body.futureGoals),
      favoriteTeacher: clean(req.body.favoriteTeacher),
      adviceForJuniors: clean(req.body.adviceForJuniors),
      achievements: clean(req.body.achievements),
      image: req.file ? `/uploads/${req.file.filename}` : ""
    });

    return res.status(201).json(entry);
  } catch (error) {
    return next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const search = clean(req.query.search);
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { collegeName: { $regex: search, $options: "i" } },
            { department: { $regex: search, $options: "i" } },
            { batchYear: { $regex: search, $options: "i" } },
            { rollNumber: { $regex: search, $options: "i" } }
          ]
        }
      : {};
    const entries = await SlamEntry.find(query).sort({ createdAt: -1 });
    return res.json(entries);
  } catch (error) {
    return next(error);
  }
});

router.post("/:id/like", async (req, res, next) => {
  try {
    const entry = await SlamEntry.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ message: "Entry not found." });
    }

    return res.json(entry);
  } catch (error) {
    return next(error);
  }
});

router.get("/export/pdf", requireAdmin, async (_req, res, next) => {
  try {
    const entries = await SlamEntry.find().sort({ createdAt: -1 });
    const doc = new PDFDocument({ margin: 48 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=slam-book-entries.pdf");

    doc.pipe(res);
    doc.fontSize(24).text("College Passout Slam Book", { align: "center" });
    doc.moveDown();

    entries.forEach((entry, index) => {
      doc.fontSize(15).text(`${index + 1}. ${entry.name}${entry.nickname ? ` (${entry.nickname})` : ""}`);
      doc.fontSize(11).text(`College: ${entry.collegeName || "N/A"}`);
      doc.text(`Batch: ${entry.batchYear || "N/A"} | Department: ${entry.department || "N/A"} | Roll No: ${entry.rollNumber || "N/A"}`);
      doc.fontSize(10).fillColor("#555").text(new Date(entry.createdAt).toLocaleString());
      doc.fillColor("#111").moveDown(0.4);
      doc.fontSize(11).text(`Current Status: ${entry.currentStatus || "N/A"}${entry.currentCity ? `, ${entry.currentCity}` : ""}`);
      doc.text(`Best College Memory: ${entry.memory || "N/A"}`);
      doc.text(`Farewell Message: ${entry.message || "N/A"}`);
      doc.text(`Future Goals: ${entry.futureGoals || "N/A"}`);
      doc.text(`Favorite Teacher/Mentor: ${entry.favoriteTeacher || "N/A"}`);
      doc.text(`Achievements: ${entry.achievements || "N/A"}`);
      doc.text(`Advice for Juniors: ${entry.adviceForJuniors || "N/A"}`);
      doc.text(`Social Link: ${entry.socialLink || "N/A"}`);
      doc.text(`Likes: ${entry.likes}`);

      if (entry.image) {
        const imagePath = path.join(serverRoot, entry.image.replace(/^\//, ""));
        if (fs.existsSync(imagePath)) {
          doc.moveDown(0.5).image(imagePath, { fit: [120, 120] });
        }
      }

      doc.moveDown().strokeColor("#dddddd").moveTo(48, doc.y).lineTo(548, doc.y).stroke().moveDown();
    });

    doc.end();
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const entry = await SlamEntry.findByIdAndDelete(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found." });
    }

    if (entry.image) {
      const imagePath = path.join(serverRoot, entry.image.replace(/^\//, ""));
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    return res.json({ message: "Entry deleted." });
  } catch (error) {
    return next(error);
  }
});

export default router;
