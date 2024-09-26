const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const multer = require('multer');

// Configure S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY || "AKIA3ZLYQ7GXSYDDORIE",
  secretAccessKey: process.env.AWS_SECRET_KEY || "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",
  region: process.env.AWS_REGION || "us-east-1"
});

// Multer setup for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload Image API to the 'icons/' folder in S3
router.post('/upload', upload.single('image'), async (req, res) => {
  const { prevUrl } = req.body; // Get prevUrl from request body

  try {
    // Check if an image file is provided
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided.',
        data: null,
      });
    }

    // If prevUrl exists, delete the old image from the 'icons/' folder
    if (prevUrl) {
      await deleteImageFromS3(prevUrl);
    }

    // Upload the new image to the 'icons/' folder in S3
    const newImageUrl = await uploadImageToS3(req.file);

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully.',
      data: { imageUrl: newImageUrl },
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.',
      data: null,
    });
  }
});

// Function to upload an image to the 'icons/' folder in S3
async function uploadImageToS3(file) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET || "tempo-creator",
    Key: `icons/${Date.now()}_${file.originalname}`, // Store in the 'icons/' folder with a unique name
    Body: file.buffer,
    ContentType: file.mimetype,
    // ACL: 'public-read' // Make the file publicly readable
  };

  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location; // Return the public URL of the uploaded image
}

// Function to delete an image from the 'icons/' folder in S3
async function deleteImageFromS3(prevUrl) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET || "tempo-creator",
    Key: getKeyFromUrl(prevUrl) // Extract the key (file path) from the URL
  };

  await s3.deleteObject(params).promise();
}

// Helper function to extract the S3 key from the URL
function getKeyFromUrl(url) {
  const urlParts = url.split('/');
  const fileKey = urlParts.slice(3).join('/'); // Extract the key (path after the bucket name)

  // Ensure the file being deleted is in the 'icons/' folder
  if (!fileKey.startsWith('icons/')) {
    throw new Error('Image is not in the icons folder');
  }

  return fileKey; // Return the key only if it's in the 'icons/' folder
}

module.exports = router;
