"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignedUrlByPath = exports.s3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
exports.s3Client = new client_s3_1.S3Client({
    region: process.env.S3_REGION_NAME,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
});
const getSignedUrlByPath = async (filePath, bucketName = process.env.BUCKET_NAME, expirationSeconds = 3600) => {
    const command = new client_s3_1.GetObjectCommand({
        Bucket: bucketName,
        Key: filePath,
    });
    return await (0, s3_request_presigner_1.getSignedUrl)(exports.s3Client, command, { expiresIn: expirationSeconds });
};
exports.getSignedUrlByPath = getSignedUrlByPath;
