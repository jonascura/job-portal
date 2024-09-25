const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jobRoutes = require("./routes/jobRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const videoRoutes = require("./routes/videoRoutes");
const employerRoutes = require("./routes/employerRoutes");
const errorHandler = require("./middleware/errorHandler");
const { admin, setAdminCustomClaims } = require("./config/firebaseAdmin");
const { connectToMongo } = require("./config/mongoDB");
const fileRoutes = require("./routes/fileRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS options
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://job-portal-frontend-980c.onrender.com",
  ], // Add your frontend URLs here
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // If you need to allow cookies or other credentials
  optionsSuccessStatus: 200,
};

// middleware setup
app.use(express.json());
app.use(cors(corsOptions)); // Use CORS with specific options

// route handling
app.use(jobRoutes);
app.use(adminRoutes);
app.use(userRoutes);
app.use(videoRoutes);
app.use(employerRoutes);
app.use(fileRoutes);

// default route
app.get("/", (req, res) => {
  res.send("Hello Developer");
});

// error handling middleware
app.use(errorHandler); // Add the error handling middleware at the end

// connect to mongoDB and set admin claims
connectToMongo()
  .then((connectedClient) => {
    // set admin claims for Firebase
    setAdminCustomClaims(adminEmails).catch(console.error);

    // send a ping to confirm a successful connection
    connectedClient
      .db("admin")
      .command({ ping: 1 })
      .then(() => {
        console.log(
          "Pinged your deployment. You are successfully connected to MongoDB!"
        );
      })
      .catch(console.error);
  })
  .catch(console.error);

// start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
