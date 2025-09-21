import FileShare from "../models/FileShare";
import FileMeta from "../models/FileMeta";
import ShareAccessLog from "../models/ShareAccessLog";
import bcrypt from "bcrypt";

export const validateShareAccess = async (req, res, next) => {
    try {
        const { shareToken } = req.params;
        const { password } = req.body;

        const share = await FileShare.findOne({
            shareToken,
            isActive: true
        }).populate('fileId sharedBy');

        if (!share) {
            return res.status(404).json({
                success: false,
                message 'Share not found or expired'
            });
        }
        //Check for expired share
        if(share.expiresAt && new Date() > share.expiresAt) {
            return res.status(410).json({
                success: false,
                message: 'Share has expired'
            });
        }

        //check password if required
        if(share.passwordHash) {
            if(!password) {
                return res.status(401).json({
                    success: false,
                    message: 'Password required',
                    passwordRequired: true
                });
            }

            const isPasswordValid = await bcrypt.compare([password, share.passwordHash]);
            if(!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid password'
                });
            }
        }
        //Add share info to request
        req.share = share;
        req.sharedFile = share.fileId;
        next();
    } 
    catch (error) {
        console.error('Share validation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error validating share access'
        });
    }
    
};

//MiddleWare to log share access
export const logShareAccess = async (req, res, next) => {
    try {
        coonst { share } = req;
        const action = req.method === 'GET'?'view' : 'download';

        //Log the access
        await ShareAccessLog.create({
            shareId: share._id,
            accessedBy: req.user?.email || req.ip,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            action,
            success: true
        });

        //Update share access count
        await FileShare.findIdAndUpdate(share._id, {
            $inc: { accessCount: 1 },
            lastAccessedAt: new Date()
        });
        next();
    }
    catch (error) {
        console.error('Share access logging error:', error);
        next();
    }
};

//Middleware to check specific permissions
export const checkSharedPermission = (requiredPermission) => {
    return (req, res, next) => {
        const { share } = req;
        const permissions = ['view', 'download','edit','upload','manage'];
        const userPermissionLevel = permissions.indexOf(share.permissions);
        const requiredPermissionLevel = permissions.indexOf(requiredPermission);

        if(userPermissionLevel >= requiredPermissionLevel) {
            next();
        }
        else {
            res.status(403).json({
                success: false,
                message: 'Insufficient Permission for this action'
            });
        }
    };
};