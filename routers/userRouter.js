// import { Router } from "express";
// import { postRegistration, postLogin } from "../controllers/userController.js";
import { Router } from "express";
import { postRegistration, postLogin } from "../controllers/userController.js";
const router = Router();

// Register route
router.post("/register", postRegistration);

// Login route
router.post("/login", postLogin);

export default router;