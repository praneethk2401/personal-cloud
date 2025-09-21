import express from 'express';
import bcrypt from 'bcrypt';
import FileShare from '../models/FileShare';
import FileMeta from '../models/FileMeta';
import { generateShareToken} from '../utils/shareTokenGenerator';
import { authMiddleWare } from '../middleware/authMiddleware';
import { validateShareAccess, logShareAccess, checkSharedPermission } from '../middleware/shareMiddleware';

const router = express.Router();

//Create a new share
router.post('/files/:fileId/share', autheMiddleware, async (req, res) => {
    try {
        const { fileId } = req.params;
        const {
            sharedWith,
            permissions = 'view',
            isPublic = false,
            password,
            expiresAt,
        } = req.body;

        //Validate file ownership
        const file = await FileMeta.findOne({
            _id: fileId,
            userId: req.params.userId
        });

        if(!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found or access is denied'
            });
        }

        //Generate share token
        const shareToken = generateShareToken();
        let passwordHash = null;
        if(password) {
            passwordHash = await bcrypt.hash(password, 12);
        }

        const share = new FileShare({
            fileId,
            shareToken,
            sharedBy: req.user._id,
            sharedWith: isPublic ? null : sharedWith,
            permissions,
            isPublic,
            passwordHash,
            expiresAt: expiresAt ? new Date(expiredAt) : null,
        });

        awwait share.save();

        await FileMeta.findByIdAndUpdate(fileId, {
            isShared: true,
            $inc: {
                shareCount: 1,
                publicShareCount: isPublic ? 1 : 0,
            },
            lastSharedAt: new Date(),
        });

        res.status(201).json({
            success: true,
            message: 'File shared successfully',
            share: {
                shareToken,
                shareUrl: `${req.protocol}://${req.get('host')}/api/public/file/${shareToken}`,
                permissions,
                isPublic,
                expiresAt: share.expiresAt,
            }
        });
    }
    catch (error) {
        console.error('Share creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating share'
        });
    }
});

//Get all shares for a file
router.get('/files/:fileId/shares' authMiddleware, async (req, res) => {
    try {
        const { fileId } = req.params;

        //verify the ownership
        const file = await Filemeta.findOne({
            _id: fileId,
            userId: req.user._id
        });

        if(!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found or access denied'
            });
        }

        const shares = await FileShare.find({
            fileId,
            isActive: true,
        }).select('-passwordHash');

        res.json({
            success: true,
            shares,
        });

    }
    catch (error) {
        console.error('Get share error:', error);
        res.status(500).json({
            suceess: false,
            message: 'Error fetching shares'
        });
    }
});

// Public file access

router.get('/public/files/:shareToken', validateShareAccess, logShareAccess, 
    checkSharedPermission('view'), async (req, res) => {
        try {
            const { shareFile } = req;
            res.json({
                success: true,
                file: {
                    _id: shareFile._id,
                    filename: shareFile.filename,
                    originalname: shareFile/orignalname,
                    mimetype: shareFile.mimetype,
                    size: shareFile.size,
                    uploadDate: shareFile.uploadDate,
                },
                permissions: req.share.permissions,
            });
        }
        catch (error) {
            console.error('Public files access error:', error);
            res.status(500).json({
                success: false,
                message: 'Error, accessing shared file',
            });
        }
    }
);

//Public file download
router.get('/public/file/:shareToken/download', validateShareAccess, logShareAccess,
    checkSharedPermission('download'), async(req, res) => {
        try {
            const { sharedFile } = req;
            const filePath = sharedFile.path;

            res.download(filePath, sharedFile.originalname);
        }
        catch (error) {
            console.error('Public file download error:', error);
            res.status(500).json({
                success: false,
                message: 'Error downloading public files'
            });
        }
    }
);

//Delete a share
router.delete('/shares/:shareId'. authMiddleware, async (req, res) => {
    try {
        const { shareId } = req.params;

        const share = await FileShare.findOne({
            _id: shareId,
            sharedBy: req.user._id
        });

        if(!share) {
            return res.status(404).json({
                success: false,
                message: 'Share not found or access denied'
            });
        }

        await FileShare.findByIdAndUpdate(shareId, { isActive: false });

        res.json({
            success: true,
            message: 'Share disabled successfully'
        });
    }
    catch (error) {
        console.error('Delete share error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleteing share'
        });
    }
});

export default router;