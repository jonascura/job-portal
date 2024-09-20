const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { connectToMongo } = require('../config/mongoDB');
const { ObjectId } = require("mongodb");
const User = require('../models/user');
const admin = require('firebase-admin');
const sendEmail = require('../middleware/sendEmail');

// register a new employer
router.post("/register-employer", async (req, res) => {
  try {
    const client = await connectToMongo();
    const employersCollection = client.db("job-portal-dev").collection("employers");

    const { companyName, email, uid } = req.body;
    const newEmployer = { companyName, email, uid };

    // check if employer already exists
    const existingEmployer = await employersCollection.findOne({ uid });
    if (existingEmployer) {
      console.log("Employer already exists with uid:", uid);
      return res.status(200).json({ message: "Employer already exists" });
    }

    console.log("Attempting to register employer:", newEmployer);
    const result = await employersCollection.insertOne(newEmployer);

    if (result.insertedId) {
      console.log("User registered successfully with ID:", result.insertedId);
      res.status(201).json({ message: "Employer registered successfully!" });

      // send admin email notification of new employer ready for review (uncomment this when Amazon SES is set up)
      // await sendEmail(
      //   // change this email
      //   'sampleEmail@hradvantageservices.com',
      //   'New Employer Registered Pending Review',
      //   `<p>A new Employer <strong>${req.body.email}</strong> has registiered for SeeWork pending for company review.<br>
      //   Sign in to SeeWork admin account to review employer <strong>https://seework-frontend.onrender.com/</strong></p>`
      // )

    } else {
      console.error("Failed to register employer");
      res.status(500).json({ message: "Failed to register employer" });
    }
  } catch (error) {
    console.error("Error in /register route:", error);
    res.status(500).json({ message: "Error registering employer", error: error.message });
  }
});

// get employer details
router.get('/employerDetails', authenticateToken, async (req, res) => {
  try {
    const client = await connectToMongo();
    console.log('Decoded token:', req.employer); // show decoded token
    const employersCollection = client.db("job-portal-dev").collection("employers");
    const employerEmail = req.employer.email; // ensure 'email' is properly set in the authentication middleware
    const employer = await employersCollection.findOne({ email: employerEmail });

    if (employer) {
      res.json(employer);
    } else {
      res.status(404).send('Employer not found');
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;