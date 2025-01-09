import express from 'express';
import mongoose, { connect } from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import foodRoute from './routes/foodRoute.js'
import { connectDB } from './config/db.js';
import userRoute from './routes/userRoute.js';
import 'dotenv/config.js'
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

// Create Express App
const app = express();
const port=4000;

// Middleware
app.use(express.json())
app.use(cors()); // Enable Cross-Origin Resource Sharing

//db connection
connectDB();

//api endpoints
app.use("/api/food",foodRoute)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRoute)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)



// Default Route
app.get('/', (req, res) => {
  res.send('Welcome to the Food Delivery App!');
});

// Start Server

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  
});

// mongodb+srv://greatstack:33858627@cluster0.iso0e.mongodb.net/?