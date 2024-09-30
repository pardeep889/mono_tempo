const s3 = require('../../../util/s3Config');

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

function getKeyFromUrlForAttachment(url) {
  const urlParts = url.split('/');
  const fileKey = urlParts.slice(3).join('/'); // Extract the key (path after the bucket name)

  // Ensure the file being deleted is in the 'icons/' folder
  if (!fileKey.startsWith('attachments/')) {
    throw new Error('Image is not in the icons folder');
  }

  return fileKey; // Return the key only if it's in the 'icons/' folder
}


async function uploadFileToS3(file, folder) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET || "tempo-creator",
    Key: `${folder}${Date.now()}_${file.originalname}`, // Store in the specified folder
    Body: file.buffer,
    ContentType: file.mimetype,
    // ACL: 'public-read' // Optionally make the file publicly readable
  };

  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location; // Return the public URL of the uploaded file
}

// Function to delete a file from S3 based on the provided URL
async function deleteFileFromS3(prevUrl) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET || "tempo-creator",
    Key: getKeyFromUrlForAttachment(prevUrl), // Extract the key (file path) from the URL
  };

  await s3.deleteObject(params).promise();
}

module.exports = {
  uploadImageToS3,
  deleteImageFromS3,
  uploadFileToS3,
  deleteFileFromS3
};
