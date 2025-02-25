import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import creatorRoutes from "./routes/creatorRoutes.js";
import editorRoutes from "./routes/editorRoutes.js";
// import messageRoutes from "./routes/messageRoutes.js";


dotenv.config();
import connectToDatabase from "./config/database.js";
connectToDatabase();

import cloudinaryConnect from "./config/cloudinary.js";
cloudinaryConnect();

const app = express();
app.use(express.json());
app.use(cors({
  credentials: true,
  origin:"https://flare-p.vercel.app/login",
}));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp"
}))
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/creator",creatorRoutes);
app.use("/api/editor",editorRoutes);
// app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});