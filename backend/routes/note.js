import express from "express";
import jwt from "jsonwebtoken";
import Note from "../models/Note.js";

const router = express.Router();
const auth = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// CRUD Notes
router.post("/", auth, async (req, res) => {
  const note = new Note({ ...req.body, userId: req.user });
  await note.save();
  res.json(note);
});

router.get("/", auth, async (req, res) => {
  const { search } = req.query;
  let filter = { userId: req.user };

  if (search) {
    // Escape regex special chars in search string
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.title = { $regex: escapedSearch, $options: "i" }; // only search by title
  }

  try {
    const notes = await Note.find(filter);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  const note = await Note.findOneAndUpdate({ _id: req.params.id, userId: req.user }, req.body, { new: true });
  res.json(note);
});

router.delete("/:id", auth, async (req, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, userId: req.user });
  res.json({ message: "Note deleted" });
});

export default router;
