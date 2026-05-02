import fs from "fs";
import path from "path";
import express from "express";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";
import { db, FieldValue, Timestamp } from "../config/firebase.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.join(__dirname, "..", "..");
const entriesCollection = db.collection("slamEntries");

function clean(value = "") {
  return String(value).trim();
}

function serializeEntry(id, data) {
  return {
    _id: id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt
  };
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

    const entryData = {
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
      image: req.file ? `/uploads/${req.file.filename}` : "",
      likes: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await entriesCollection.add(entryData);
    const entry = serializeEntry(docRef.id, entryData);

    return res.status(201).json(entry);
  } catch (error) {
    return next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const search = clean(req.query.search);
    const snapshot = await entriesCollection.orderBy("createdAt", "desc").get();
    let entries = snapshot.docs.map((doc) => serializeEntry(doc.id, doc.data()));

    if (search) {
      const term = search.toLowerCase();
      entries = entries.filter((entry) =>
        [entry.name, entry.collegeName, entry.department, entry.batchYear, entry.rollNumber]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term))
      );
    }

    return res.json(entries);
  } catch (error) {
    return next(error);
  }
});

router.post("/:id/like", async (req, res, next) => {
  try {
    const docRef = entriesCollection.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Entry not found." });
    }

    await docRef.update({
      likes: FieldValue.increment(1),
      updatedAt: Timestamp.now()
    });
    const updatedDoc = await docRef.get();
    const entry = serializeEntry(updatedDoc.id, updatedDoc.data());

    return res.json(entry);
  } catch (error) {
    return next(error);
  }
});

router.get("/export/pdf", requireAdmin, async (_req, res, next) => {
  try {
    const snapshot = await entriesCollection.orderBy("createdAt", "desc").get();
    const entries = snapshot.docs.map((doc) => serializeEntry(doc.id, doc.data()));
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
      const createdAt = new Date(entry.createdAt);
      doc.fontSize(10).fillColor("#555").text(createdAt.toLocaleString());
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
    const docRef = entriesCollection.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Entry not found." });
    }

    const entry = doc.data();

    if (entry.image) {
      const imagePath = path.join(serverRoot, entry.image.replace(/^\//, ""));
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await docRef.delete();

    return res.json({ message: "Entry deleted." });
  } catch (error) {
    return next(error);
  }
});

export default router;
