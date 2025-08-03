import mongoose from "mongoose";

const fileMetaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  size: Number,
  mimetype: String,
  ownerId: { type: String, default: 'demoUser' },
  createdAt: { type: Date, default: Date.now },
  aiTags: {String},
});

export default mongoose.model('FileMeta', fileMetaSchema);