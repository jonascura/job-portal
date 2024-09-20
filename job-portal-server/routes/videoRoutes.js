const express = require('express');
const router = express.Router();
const { ObjectId } = require("mongodb");
const { connectToMongo } = require('../config/mongoDB');

// get all videos
router.get("/all-videos", async (req, res) => {
  const client = await connectToMongo();
  const videosCollection = client.db("job-portal-dev").collection("videos");
  const videos = await videosCollection.find().toArray();
  const transformedVideos = videos.map((video) => {
    let url = video.url;
    if (url.includes("youtube.com")) {
      url = url.replace("watch?v=", "embed/");
    }
    // else if (url.includes("fb.watch")) {
    //   url = `https://www.facebook.com/plugins/video.php?href=${url}`;
    // }
    return { ...video, url };
  });
  res.send(transformedVideos);
});


module.exports = router;
