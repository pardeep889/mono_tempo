const { uploadImageToS3, deleteImageFromS3, deleteFileFromS3, uploadFileToS3 } = require('../services/uploadService');

// Upload Image Controller
const uploadImage = async (req, res) => {
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
};

const uploadAttachment = async (req, res) => {
    const { prevUrl } = req.body; // Get prevUrl from request body
  
    try {
      // Check if a file is provided
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file provided.',
          data: null,
        });
      }
  
      // If prevUrl exists, delete the old file from the 'attachments/' folder
      if (prevUrl) {
        await deleteFileFromS3(prevUrl);
      }
  
      // Upload the new file to the 'attachments/' folder in S3
      const fileUrl = await uploadFileToS3(req.file, 'attachments/');
  
      return res.status(200).json({
        success: true,
        message: 'Attachment uploaded successfully.',
        data: { fileUrl },
      });
    } catch (error) {
      console.error("Error uploading attachment:", error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error.',
        data: null,
      });
    }
  };

module.exports = {
  uploadImage,
  uploadAttachment
};
