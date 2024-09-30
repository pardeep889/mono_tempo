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
    uploadAttachment(req, res);
  });
});

module.exports = router;
