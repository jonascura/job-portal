const express = require('express');
const router = express.Router();
const { ObjectId } = require("mongodb");
const { connectToMongo } = require('../config/mongoDB');
const sendEmail = require('../middleware/sendEmail');

//get all jobs
router.get("/all-jobs", async (req, res) => {
  const client = await connectToMongo();
  const jobsCollection = client.db("job-portal-dev").collection("demoJobs");
  const jobs = await jobsCollection.find().toArray();
  res.send(jobs);
});

// Get a job by ID
router.get("/all-jobs/:id", async (req, res) => {
  const client = await connectToMongo();
  const jobsCollection = client.db("job-portal-dev").collection("demoJobs");
  const id = req.params.id;
  
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid job ID format" });
  }

  try {
    const job = await jobsCollection.findOne({ _id: new ObjectId(id) });
    if (!job) {
      return res.status(404).send({ message: "Job not found" });
    }
    res.send(job);
  } catch (err) {
    console.error("Error fetching job by ID:", err);
    res.status(500).send({ message: "Error fetching job", error: err.message });
  }
});

//post a job
router.post("/post-job", async (req, res) => {
  const client = await connectToMongo();
  const jobsCollection = client.db("job-portal-dev").collection("demoJobs");
  const body = req.body;
  body.createdAt = new Date();

  try {
    const result = await jobsCollection.insertOne(body);
    if (result.insertedId) {
      // send notification to the admin upon job post request success (uncomment this section when Amazon SES is setup)
      // await sendEmail(
        //   // to
        //   // change this email
      //   'sampleEmail@hradvantageservices.com',
      //   // subject
      //   'New Job Submission Pending Approval',
      //   // body
      //   `<p>A new job has been submitted by <strong>${body.postedBy}</strong> and is pending your approval. <br>
      //   Sign in to SeeWork admin account to review job posting <strong>https://seework-frontend.onrender.com/</strong></p>`
      // );
      res.status(200).send(result);
    } else {
      res.status(404).send({
        message: "Cannot insert! Try again later",
        status: false
      });
    }
  } catch (err) {
    console.error("Error posting job:", err);
    res.status(500).send({ message: 'Error posting job', error: err.message });
  }
});

// get job by email
router.get("/myJobs/:email", async (req, res) => {
  const client = await connectToMongo();
  const jobsCollection = client.db("job-portal-dev").collection("demoJobs");
  const jobs = await jobsCollection.find({ postedBy: req.params.email }).toArray();
  res.send(jobs);
});

// delete a job
router.delete("/job/:id", async (req, res) => {
  const client = await connectToMongo();
  const jobsCollection = client.db("job-portal-dev").collection("demoJobs");
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const result = await jobsCollection.deleteOne(filter);
  res.send(result);
});

// update job approval
router.put("/job/:id", async (req, res) => {
  const client = await connectToMongo();
  const jobsCollection = client.db("job-portal-dev").collection("demoJobs");
  const id = req.params.id;
  const updates = req.body;
  const filter = { _id: new ObjectId(id) };
  const updateDoc = { $set: updates };

  try {
    const result = await jobsCollection.updateOne(filter, updateDoc);
    if (result.modifiedCount === 1) {
      res.status(200).send({ success: true, message: 'Job updated successfully' });
    } else if (result.matchedCount === 0) {
      res.status(404).send({ success: false, message: 'Job not found' });
    } else {
      res.status(200).send({ success: false, message: 'No changes made to the job' });
    }
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).send({ success: false, message: 'Failed to update job' });
  }
});

 // autocomplete the updatedAt field for the location input
 router.get("/autocomplete-location", async (req, res) => {
  const { term } = req.query;
  try {
    const client = await connectToMongo();
    const collection = client.db("job-portal-dev").collection("locations");
    // Using regex to match the start of any word in the city names
    const locations = await collection
      .find(
        {
          searchKey: { $regex: new RegExp("^" + term, "i") },
        },
        {
          projection: { _id: 0, fullName: 1 },
        }
      )
      .limit(10)
      .toArray();
    res.json(locations.map((loc) => loc.fullName));
  } catch (err) {
    console.error("Autocomplete query error:", err);
    res.status(500).send("Error processing autocomplete request");
  }
 });


// Search for jobs
router.get("/search", async (req, res) => {
  const client = await connectToMongo();
  const jobsCollection = client.db("job-portal-dev").collection("demoJobs");

  try {
    const { jobTitle, jobLocation } = req.query;
    let query = {};

    if (jobTitle && jobLocation) {
      // Search for both job title and location
      query.$text = { $search: `"${jobTitle}" "${jobLocation}"` };
    } else if (jobTitle) {
      // Search only by job title
      query.$text = { $search: `"${jobTitle}"` };
    } else if (jobLocation) {
      // Search only by location
      query.$text = { $search: `"${jobLocation}"` };
    } else {
      // If no parameters are provided, return all jobs
      return res.json(await jobsCollection.find({}).toArray());
    }

    const jobs = await jobsCollection
      .find(query, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .toArray();
    res.json(jobs);
  } catch (error) {
    console.error("Search error:", error);
    res
      .status(500)
      .json({ message: "Error searching for jobs", error: error.message });
  }
});


// Fetch related jobs based on tags
router.get("/related-jobs", async (req, res) => {
  const { tags, excludeId } = req.query; // 'tags' is a comma-separated string of job tags
  const limit = 6; // Limit the number of related jobs to fetch

  try {
    const client = await connectToMongo();
    const jobsCollection = client.db("job-portal-dev").collection("demoJobs");

    // Convert comma-separated tags string to an array
    const tagsArray = tags.split(",");

    let relatedJobs = []; // Array to store related jobs
    let relatedJobsSet = new Set(); // Set to track unique job IDs to avoid duplicates
    let currentLimit = limit; // Remaining number of jobs to fetch

    // Convert excludeId to ObjectId once, to avoid errors in comparison
    const excludeObjectId = new ObjectId(excludeId);

    // Loop through each tag and fetch related jobs
    for (let i = 0; i < tagsArray.length; i++) {
      if (currentLimit <= 0) break; // Stop if we already have the desired number of related jobs

      const tag = tagsArray[i].trim(); // Current tag to search for

      // Fetch jobs based on the current tag, excluding the current job by ID and avoiding duplicates
      const jobs = await jobsCollection
        .find({
          $and: [
            { tags: { $in: [tag] } }, // Match jobs that contain the current tag
            { _id: { $ne: excludeObjectId } }, // Exclude the current job by ObjectId
            {
              _id: {
                $nin: Array.from(relatedJobsSet).map((id) => new ObjectId(id)),
              },
            }, // Exclude already fetched jobs
          ],
        })
        .limit(currentLimit) // Limit to the remaining number of jobs needed
        .toArray();

      // Add the fetched jobs to the result set
      jobs.forEach((job) => {
        if (!relatedJobsSet.has(job._id.toString())) {
          // Avoid adding duplicate jobs
          relatedJobs.push(job);
          relatedJobsSet.add(job._id.toString());
        }
      });

      currentLimit = limit - relatedJobs.length; // Update the remaining number of jobs to fetch
    }

    res.status(200).json(relatedJobs); // Return the fetched related jobs
  } catch (err) {
    console.error("Error fetching related jobs:", err);
    res
      .status(500)
      .send({ message: "Failed to fetch related jobs", error: err.message });
  }
});



module.exports = router;
