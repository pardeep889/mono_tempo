const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage, uploadAttachment } = require('../modules/upload/controller/uploadController');

// Multer setup for handling image uploads (2MB limit)
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit for images
}).single('image');

// Multer setup for handling attachment uploads (25MB limit)
const attachmentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit for attachments
}).single('file');

// Allowed MIME types for images
const allowedImageTypes = [
  'image/jpeg', 
  'image/png', 
  'image/gif', 
  'image/bmp', 
  'image/webp',
  'image/svg+xml'
];

// Allowed MIME types for attachments (audio, video, documents, etc.)
const allowedAttachmentTypes = [
  // Documents
  'application/pdf', 
  'application/msword', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  
  // Audio
  'audio/mpeg', // MP3
  'audio/wav',  // WAV
  'audio/ogg',  // OGG

  // Video
  'video/mp4',  // MP4
  'video/x-msvideo', // AVI
  'video/x-flv', // FLV
  'video/webm',  // WEBM
  'video/quicktime', // MOV
  'video/3gpp',  // 3GP (added)


  // Images
  ...allowedImageTypes // Include image types for attachments as well
];

// Route for image upload with 2MB limit
router.post('/icon', (req, res) => {
  imageUpload(req, res, function (err) {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File is too large. The limit is 2MB for images.',
        data: null
      });
    } else if (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error.',
        data: null
      });
    }

    // Validate file type for images
    if (!allowedImageTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type for images. Allowed types: JPEG, PNG, GIF, BMP, WEBP, SVG.',
        data: null
      });
    }

    // Proceed with image upload
    uploadImage(req, res);
  });
});

// Route for attachment upload with 25MB limit
router.post('/attachment', (req, res) => {
  attachmentUpload(req, res, function (err) {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File is too large. The limit is 25MB for attachments.',
        data: null
      });
    } else if (err) {
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error.',
        data: null
      });
    }

    // Validate file type for attachments
    if (!allowedAttachmentTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type for attachments. Allowed types: PDF, DOC, DOCX, MP3, WAV, OGG, MP4, AVI, FLV, WEBM, MOV, and images.',
        data: null
      });
    }

    // Proceed with attachment upload
    uploadAttachment(req, res);
  });
});

module.exports = router;
