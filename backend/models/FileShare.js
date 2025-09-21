import mongoose from 'mongoose';

const fileShareSchema = new mongoose.Schema({
  fileId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'FileMeta', 
    required: true 
  },
  folderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Folder' 
  },
  
  shareToken: { 
    type: String, 
    unique: true, 
    required: true 
  },
  sharedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  sharedWith: { 
    type: String // Email or null for public
  },
  
  permissions: {
    type: String,
    enum: ['view', 'download', 'edit', 'upload', 'manage'],
    default: 'view'
  },
  
  passwordHash: String,
  isPublic: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  
  expiresAt: Date,
  accessCount: { type: Number, default: 0 },
  lastAccessedAt: Date,
  
  folderOptions: {
    includeSubfolders: { type: Boolean, default: true },
    allowSubfolderCreation: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Indexes for performance
fileShareSchema.index({ shareToken: 1 });
fileShareSchema.index({ fileId: 1 });
fileShareSchema.index({ sharedBy: 1 });
fileShareSchema.index({ sharedWith: 1 });
fileShareSchema.index({ expiresAt: 1 });

export default mongoose.model('FileShare', fileShareSchema);