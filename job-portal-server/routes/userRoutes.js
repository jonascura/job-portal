const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { connectToMongo } = require('../config/mongoDB');
const { ObjectId } = require("mongodb");
const User = require('../models/user');
const admin = require('firebase-admin');

// test connection
router.get("/test-connection", async (req, res) => {
  try {
    const client = await connectToMongo();
    await client.db("admin").command({ ping: 1 });
    res.status(200).json({ message: "Connected to MongoDB from userRoutes" });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).json({ message: "Error connecting to MongoDB", error: error.message });
  }
});

// register a new user
router.post("/register", async (req, res) => {
  try {
    const client = await connectToMongo();
    const usersCollection = client.db("job-portal-dev").collection("users");

    const { firstName, lastName, email, uid } = req.body;
    const newUser = { firstName, lastName, email, uid };

    // check if user already exists
    const existingUser = await usersCollection.findOne({ uid });
    if (existingUser) {
      console.log("User already exists with uid:", uid);
      return res.status(200).json({ message: "User already exists" });
    }

    console.log("Attempting to register user:", newUser);
    const result = await usersCollection.insertOne(newUser);

    if (result.insertedId) {
      console.log("User registered successfully with ID:", result.insertedId);
      res.status(201).json({ message: "User registered successfully!" });
    } else {
      console.error("Failed to register user");
      res.status(500).json({ message: "Failed to register user" });
    }
  } catch (error) {
    console.error("Error in /register route:", error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

// get user details
router.get('/userDetails', authenticateToken, async (req, res) => {
  try {
    const client = await connectToMongo();
    console.log('Decoded token:', req.user); // show decoded token
    console.log('User email from token:', req.user.email);
    console.log('User name from token:', req.user.name); // where is .name coming from when userDetails show .displayName?
    console.log('User displayName from token:', req.user.displayName);
    
    const usersCollection = client.db("job-portal-dev").collection("users");
    const userEmail = req.user.email; // ensure 'email' is properly set in the authentication middleware
    const user = await usersCollection.findOne({ email: userEmail });

    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).send('Server error');
  }
});

// update user details
router.put('/update', authenticateToken, async (req, res) => {
  try {
    const client = await connectToMongo();
    const usersCollection = client.db("job-portal-dev").collection("users");

    const { firstName, lastName, email } = req.body;
    const userEmail = req.user.email;

    const updateData = { firstName, lastName, email };

    const result = await usersCollection.updateOne(
      { email: userEmail },
      { $set: updateData }
    );

    if (result.matchedCount > 0) {
      res.status(200).json({ message: "User details updated successfully!" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
