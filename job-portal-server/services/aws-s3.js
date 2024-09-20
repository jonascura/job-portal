// /backend/services/aws-s3.js
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const videoFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Not a video file!"), false);
  }
};

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "seework-company-video",
    contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically set the ContentType header
    key: function (request, file, cb) {
      cb(null, `videos/${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 1024 * 1024 * 500 }, // 500 MB limit for video files
  fileFilter: videoFileFilter,
});


module.exports = upload;
