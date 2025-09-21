import mongoose from 'mongoose';

const shareAccessLogSchema = new mongoose.Schema({
    shareId: {
        type: mongoose.Schea.Types.ObjectId,
        ref: 'FileShare',
        required: true
    },

    accessedBy: String,
    ipAddress: String,
    userAgent: String,

    action: {
        type: String,
        enum: ['view', 'download', 'edit', 'upload', 'manage'],
        required: true
    },
    filePath: String,

    success: { type: Boolean, default: true },
    errorMeesage: String,

    accessedAt: { type: Date, default: Date.now },
});

//Indexes
shareAccessLogSchema.index({ shareId: 1 });
shareAccessLogSchema.index({ accessedBy: 1 });
shareAccessLogSchema.index({ ipAddress: 1 });

export default mongoose.model('ShareAccessLog', shareAccessLogSchema);