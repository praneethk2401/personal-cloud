import crypto from 'crypto';

export const generateShareToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

export const generateInivitationToken = () => {
    return crypto.randomBytes(16).toString('hex');
};

export const generateSecureId = () => {
    return crypto.randomBytes(12).toString('hex');
};

export default {
    generateShareToken,
    generateInivitationToken,
    generateSecureId
};