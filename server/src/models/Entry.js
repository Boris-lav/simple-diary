import mongoose from 'mongoose';


const EntrySchema = new mongoose.Schema(
{
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
date: { type: String, required: true }, // YYYY-MM-DD
title: { type: String, default: '' },
text: { type: String, required: true }
},
{ timestamps: true }
);


export default mongoose.model('Entry', EntrySchema);