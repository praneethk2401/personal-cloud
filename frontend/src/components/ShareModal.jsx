//This is the popup/modal that appears 
// //when users click the "Share" button next to a file.
import React, { useState } from 'react';
import { X, Copy, Eye, Download, Edit, Link, Mail, Lock, Calendar } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, file, onShare }) => {
    const [sharedData, setSharedData] = useState({
        sharedWith: '',
        permissions: 'view',
        isPublic: false,
        password: '',
        expiresAt: null,
    });

    const [shareUrl, setShareUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const permissionOptions = [
        { value: 'view', label: 'View Only', icon: Eye, description: 'Can see file details' },
        { value: 'download', label: 'Download', icon: Download, description: 'Can view and download' },
        { value: 'edit', label: 'Edit', icon: Edit, description: 'Can view, download, and edit' }
    ];

    const handleShare = async () => {
        setIsLoading(true);
        try{
            const response = await fetch(`/api/files/${files._id}/share`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    ...sharedData,
                    sharedWith: shareData.isPublic ? null : shareData.sharedWith,
                })
            });

            const result = await response.json();
            if(result.success) {
                setShareUrl(result.share.shareUrl);
                onShare?.(result.share);
            }
            else{
                alert('Failed to create share: ' + result.message);
            }
        }
        catch(error){
            console.error('Error creating share:', error);
            alert('Failed to create share');
        }
        setIsLoading(false);
    };

    const copyToClipboard = () => {
        try{
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
        catch(error){
            console.error('Copy failed:', error);
            alert('Failed to copy share URL');
        }
    };

    const resetForm = () => {
        setShareData({
            sharedWith: '',
            permissions: 'view',
            isPublic: false,
            password: '',
            expiresAt: '',
        });
        setShareUrl('');
        setCopied(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Share File
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
    
            {/* File Info */}
            <div className="p-6 border-b bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {file?.originalname?.charAt(0)?.toUpperCase() || 'F'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{file?.originalname}</p>
                  <p className="text-sm text-gray-500">
                    {file?.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}
                  </p>
                </div>
              </div>
            </div>
    
            <div className="p-6 space-y-6">
              {/* Public Link Toggle */}
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shareData.isPublic}
                    onChange={(e) => setShareData(prev => ({ 
                      ...prev, 
                      isPublic: e.target.checked,
                      sharedWith: e.target.checked ? '' : prev.sharedWith
                    }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    <Link size={16} className="text-blue-600" />
                    <span className="font-medium text-gray-700">Create public link</span>
                  </div>
                </label>
                <p className="text-sm text-gray-500 ml-7">
                  Anyone with the link can access this file
                </p>
              </div>
    
              {/* Email Input (only if not public) */}
              {!shareData.isPublic && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Share with email address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={shareData.sharedWith}
                      onChange={(e) => setShareData(prev => ({ ...prev, sharedWith: e.target.value }))}
                      placeholder="Enter email address"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      required={!shareData.isPublic}
                    />
                  </div>
                </div>
              )}
    
              {/* Permissions */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Permission level
                </label>
                <div className="space-y-2">
                  {permissionOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="permissions"
                        value={option.value}
                        checked={shareData.permissions === option.value}
                        onChange={(e) => setShareData(prev => ({ ...prev, permissions: e.target.value }))}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <option.icon size={16} className="text-gray-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-700">{option.label}</p>
                        <p className="text-sm text-gray-500">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
    
              {/* Password Protection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password protection (optional)
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={shareData.password}
                    onChange={(e) => setShareData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password (optional)"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>
    
              {/* Expiration Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Expiration date (optional)
                </label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="datetime-local"
                    value={shareData.expiresAt}
                    onChange={(e) => setShareData(prev => ({ ...prev, expiresAt: e.target.value }))}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>
    
              {/* Share URL Display */}
              {shareUrl && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Share link
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                    />
                    <button
                      onClick={copyToClipboard}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        copied
                          ? 'bg-green-600 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {copied ? 'Copied!' : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              )}
    
              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                {!shareUrl ? (
                  <>
                    <button
                      onClick={handleClose}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleShare}
                      disabled={isLoading || (!shareData.isPublic && !shareData.sharedWith)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? 'Creating...' : 'Create Share Link'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleClose}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
    );
}

export default ShareModal;