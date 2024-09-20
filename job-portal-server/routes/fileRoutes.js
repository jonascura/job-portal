// /backend/routes/fileRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../services/aws-s3");
const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const s3 = require("../services/aws-config");

router.post("/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    res.json({
      message: "File uploaded successfully",
      url: req.file.location,
    });
  } else {
    res.status(400).send("File upload failed");
  }
});

// This route lists all videos stored in S3
router.get('/s3-videos', async (req, res) => {
  const params = {
    Bucket: "seework-company-video",
    Prefix: 'videos/' // Assuming your videos are stored under the 'videos/' directory in S3
  };

  try {
    const command = new ListObjectsV2Command(params);
    const s3Data = await s3.send(command);
    if (s3Data.Contents && s3Data.Contents.length > 0) {
      const videos = s3Data.Contents.map(item => {
        return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`;
      });
      res.json(videos);
    } else {
      console.log('No videos found or empty contents.');
      res.status(404).send('No videos found.');
    }
  } catch (err) {
    console.error('Error fetching videos from S3:', err);
    res.status(500).send('Failed to retrieve videos.');
  }
});


module.exports = router;
