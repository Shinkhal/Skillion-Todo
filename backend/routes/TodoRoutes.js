import express from "express";
import Todo from "../models/Todo.js";


const router = express.Router();

router.get("/", async (req, res) => {
try {
const todos = await Todo.find().sort({ createdAt: -1 });
res.json(todos);
} catch (err) {
res.status(500).json({ error: err.message });
}
});

router.post("/", async (req, res) => {
try {
const { title, description, status } = req.body;
const todo = new Todo({ title, description, status });
await todo.save();
res.status(201).json(todo);
} catch (err) {
res.status(400).json({ error: err.message });
}
});


router.put("/:id", async (req, res) => {
try {
const { id } = req.params;
const update = req.body;
const todo = await Todo.findByIdAndUpdate(id, update, { new: true });
if (!todo) return res.status(404).json({ error: "Not found" });
res.json(todo);
} catch (err) {
res.status(400).json({ error: err.message });
}
});

router.delete("/:id", async (req, res) => {
try {
const { id } = req.params;
const todo = await Todo.findByIdAndDelete(id);
if (!todo) return res.status(404).json({ error: "Not found" });
res.json({ success: true });
} catch (err) {
res.status(400).json({ error: err.message });
}
});


export default router;