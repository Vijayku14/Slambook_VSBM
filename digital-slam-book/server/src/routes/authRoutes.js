import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { db } from "../config/firebase.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const adminsCollection = db.collection("admins");

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = email.toLowerCase();
    const snapshot = await adminsCollection.where("email", "==", normalizedEmail).limit(1).get();
    const adminDoc = snapshot.empty ? null : snapshot.docs[0];
    const admin = adminDoc ? adminDoc.data() : null;
    const isValid = admin ? await bcrypt.compare(password, admin.password) : false;

    if (!isValid) {
      return res.status(401).json({ message: "Invalid admin credentials." });
    }

    const token = jwt.sign(
      { id: adminDoc.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ token, admin: { email: admin.email } });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", requireAdmin, (req, res) => {
  res.json({ admin: req.admin });
});

export default router;
