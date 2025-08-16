import mongoose from "mongoose";

const fileMetaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  size: Number,
  mimetype: String,
  ownerId: { type: String, required: true }, // Associate the file with the authenticated user
  createdAt: { type: Date, default: Date.now },
  aiTags: {String},
});

export default mongoose.model('FileMeta', fileMetaSchema);