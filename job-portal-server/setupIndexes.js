// this file is for creating indexes in the MongoDB collection had run this file once to create indexes (finished this step already)

const { MongoClient } = require("mongodb");
require("dotenv").config(); // Make sure to include dotenv if you're using environment variables
console.log(process.env.DB_USER, process.env.DB_PASSWORD);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@job-portal-dev.7l5vbor.mongodb.net/?retryWrites=true&w=majority&appName=job-portal-dev`; // Ensure your MongoDB URI is loaded from an environment variable

const client = new MongoClient(uri);

const createTextIndex = async () => {
  try {
    await client.connect();
    const jobsCollection = client.db("job-portal-dev").collection("demoJobs");

    // Creating a compound text index
    const response = await jobsCollection.createIndex({
      jobTitle: "text",
      tags: "text",
      jobLocation: "text",
    });

    console.log("Text index created:", response);
  } catch (e) {
    console.error("Error creating text index:", e);
  } finally {
    await client.close();
  }
};

createTextIndex(); // Run the function to create the index
