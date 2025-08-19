import { Router } from 'express';
import Entry from '../models/Entry.js';
import { auth } from '../middleware/auth.js';


const router = Router();


// All routes below require auth
router.use(auth);


// List entries (newest first)
router.get('/', async (req, res) => {
const list = await Entry.find({ userId: req.user.id }).sort({ createdAt: -1 });
res.json(list);
});


// Create
router.post('/', async (req, res) => {
const { date, title = '', text } = req.body || {};
if (!date || !text) return res.status(400).json({ error: 'date and text required' });
const entry = await Entry.create({ userId: req.user.id, date, title, text });
res.status(201).json(entry);
});


// Update
router.put('/:id', async (req, res) => {
const { id } = req.params;
const { date, title, text } = req.body || {};
const entry = await Entry.findOneAndUpdate(
{ _id: id, userId: req.user.id },
{ $set: { ...(date && { date }), ...(title !== undefined && { title }), ...(text !== undefined && { text }) } },
{ new: true }
);
if (!entry) return res.status(404).json({ error: 'not found' });
res.json(entry);
});


// Delete
router.delete('/:id', async (req, res) => {
const { id } = req.params;
const out = await Entry.findOneAndDelete({ _id: id, userId: req.user.id });
if (!out) return res.status(404).json({ error: 'not found' });
res.json({ ok: true });
});


export default router;