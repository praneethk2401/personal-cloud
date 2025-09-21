import mongoose from "mongoose";

const fileMetaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  size: Number,
  mimetype: String,
  ownerId: { type: String, required: true }, // Associate the file with the authenticated user
  createdAt: { type: Date, default: Date.now },
  aiTags: String,

  //New Sharng fields
  isShared: { type: Boolean, default: false },
  shareCount: { type: Number, default: 0},
  sharedWith: { type: [String], default: [] },
  lastSharedAt: { type: Date, default: null},

  //Direct Sharing data for simple shares
  shares: [{
    shareId: { type: String, unique: true}, //Generated Token 
    sharedWith: { type: String, default: []}, //email or null for public
    permissions: { type: String, enum: ['view', 'download', 'edit']},
    isPublic: { type: Boolean, default: false},
    passwordHash: { type: String, default: null},
    expiresAt: { type: Date },
    createdAt: { type: Date, default: Date.now},
    accessCount: { type: Number, default: 0},
    lastAccessedAt: { type: Date },
  }]
}, { timestamps: true });

//Indexes for performance
fileMetaSchema.index({ filename: 1 });
fileMetaSchema.index({ ownerId: 1 });
fileMetaSchema.index({ isShared: 1 });
fileMetaSchema.index({ sharedWith: 1 });
fileMetaSchema.index({ lastSharedAt: 1 });
fileMetaSchema.index({ shares.shareId: 1 });
fileMetaSchema.index({ shares.sharedWith: 1 });
fileMetaSchema.index({ shares.expiresAt: 1 });

export default mongoose.model('FileMeta', fileMetaSchema);