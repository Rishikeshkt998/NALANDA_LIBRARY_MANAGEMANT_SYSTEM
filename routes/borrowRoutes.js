import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { borrowBook,returnBook,borrowHistory } from "../controllers/borrowController.js";

const router = express.Router();
router.post("/borrowbook", protect(["Member"]), borrowBook);

router.post("/returnbook", protect(["Member"]), returnBook);

router.get("/borrowhistory", protect(["Member"]), borrowHistory);

export default router;