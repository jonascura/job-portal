const fs = require("fs");
const { parse } = require("csv-parse");
const { MongoClient } = require("mongodb");
require("dotenv").config();


const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@job-portal-dev.7l5vbor.mongodb.net/?retryWrites=true&w=majority&appName=job-portal-dev`; // MongoDB URL
const dbName = "job-portal-dev"; // Database name
const client = new MongoClient(url);

async function importData() {
  const parser = fs
    .createReadStream("./canadacities.csv") // Update with your actual file path
    .pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
      })
    );

  const collectionData = [];

  for await (const record of parser) {
    // Parse and structure each record based on your CSV column headers
    collectionData.push({
      city: record.city,
      provinceID: record.province_id,
      provinceName: record.province_name,
      fullName: `${record.city}, ${record.province_name}`, // Combining city and province for full name
      searchKey: `${record.city}, ${record.province_name}`.toLowerCase(), // Search key in lowercase for case-insensitive search
      latitude: parseFloat(record.lat),
      longitude: parseFloat(record.lng),
      population: parseInt(record.population),
    });
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("locations");
    await collection.createIndex({ searchKey: "text" }); // Ensure there is a text index on searchKey
    const result = await collection.insertMany(collectionData);
    console.log(`${result.insertedCount} records inserted.`);
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  } finally {
    await client.close();
  }
}

importData();
