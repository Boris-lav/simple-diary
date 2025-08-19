import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';


const router = Router();


router.post('/register', async (req, res) => {
const { username, password } = req.body || {};
if (!username || !password) return res.status(400).json({ error: 'username and password required' });
const exists = await User.findOne({ username });
if (exists) return res.status(409).json({ error: 'user already exists' });
const passwordHash = await bcrypt.hash(password, 10);
const user = await User.create({ username, passwordHash });
return res.status(201).json({ id: user._id, username: user.username });
});


router.post('/login', async (req, res) => {
const { username, password } = req.body || {};
const user = await User.findOne({ username });
if (!user) return res.status(401).json({ error: 'invalid credentials' });
const ok = await bcrypt.compare(password, user.passwordHash);
if (!ok) return res.status(401).json({ error: 'invalid credentials' });
const token = jwt.sign({ sub: user._id.toString(), username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
return res.json({ token, user: { id: user._id, username: user.username } });
});


export default router;