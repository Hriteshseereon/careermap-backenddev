import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "./s3.js";

// 🔥 Reusable upload function
export const uploadToS3 = async (file, folder) => {
  try {
    if (!file) return null;

    const fileName = file.originalname.replace(/\s+/g, "-");

    const key = `${folder}/${Date.now()}-${fileName}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return url;
  } catch (error) {
    console.error("❌ S3 Upload Error:", error);
    throw new Error("Failed to upload image");
  }
};