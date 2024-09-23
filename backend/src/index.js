import dotenv from "dotenv";
import connectDB from './db/index.js'; 
import { app } from './app.js'; // Assuming app is exported from './app.js'

// Load environment variables
dotenv.config({ path: './.env' });

// Connect to the database and start the server
connectDB()
  .then(() => {
    // Start the server after the database connection is successful
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });