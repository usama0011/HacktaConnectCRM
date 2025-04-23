// routes/upload.js
import express from "express";
import multer from "multer";
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY, // ✅ Match this to your .env
  region: process.env.AWS_REGION,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  const params = {
    Bucket: "hacktaconnectcrm",
    Key: `hacktaconnectcrm-images/${Date.now()}-${req.file.originalname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  s3.upload(params, (err, data) => {
    if (err)
      return res.status(500).json({ message: "S3 upload failed", error: err });
    res.status(200).json({ url: data.Location });
  });
});

export default router;
