import express from "express";
import {login, loginWithGoogle, signup, logout} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/logout",  logout);

router.post("/loginwithGoogle",loginWithGoogle);

export default router;
