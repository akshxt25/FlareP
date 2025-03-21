import express from "express";
import { auth, isCreator, isEditor } from "../middlewares/auth.js";
import { getVideos, uploadVideo, assignEditor, uploadVideoToYouTube, getAllEditors, searchVideos } from "../controllers/creatorController.js";


const router = express.Router();

router.post("/creator-upload-video", auth, isCreator, uploadVideo);
router.get("/creator-get-videos", auth, getVideos);
router.get('/getEditors', getAllEditors);
router.post("/assign-editor", auth, assignEditor);

router.post("/creator-upload-to-youtube", uploadVideoToYouTube);

router.get("/creator-search-videos", auth, isCreator, searchVideos);

export default router;