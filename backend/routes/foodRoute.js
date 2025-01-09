import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from 'multer'; 

const foodRouter = express.Router();

// Image Storage Engine

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure the 'uploads' folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload=multer({ storage })

foodRouter.post("/add",upload.single('file'),addFood)
foodRouter.get("/list",listFood)
foodRouter.post("/remove",removeFood)
export default foodRouter;
