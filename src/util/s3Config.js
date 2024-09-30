const AWS = require('aws-sdk');

// Configure S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY || "AKIA3ZLYQ7GXSYDDORIE",
  secretAccessKey: process.env.AWS_SECRET_KEY || "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",
  region: process.env.AWS_REGION || "us-east-1"
});

module.exports = s3;
