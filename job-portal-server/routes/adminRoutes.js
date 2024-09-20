const express = require('express');
const router = express.Router();
const { setAdminCustomClaims, setRoleCustomClaims } = require('../config/firebaseAdmin');
const { connectToMongo } = require('../config/mongoDB');

// set admin claims (called on admin registration)
router.post("/setAdminClaims", async (req, res) => {
  const { emails } = req.body;
  if (!Array.isArray(emails) || emails.length === 0) {
    return res.status(400).send("Invalid email list");
  }

  try {
    await setAdminCustomClaims(emails);
    return res.status(200).send("Admin claims set successfully");
  } catch (error) {
    console.error("Error setting admin claims:", error);
    return res.status(500).send("Failed to set admin claims");
  }
});


//  set user role (called on registration)
router.post("/setUserRole", async (req, res) => {
  const { email, role } = req.body;
  if (!email || !role) {
    return res.status(400).send("Invalid request");
  }

  try {
    await setRoleCustomClaims(email, role);
    return res.status(200).send("Role set successfully");
  } catch (error) {
    console.error("Error setting role:", error);
    return res.status(500).send("Failed to set role");
  }
});

module.exports = router;
