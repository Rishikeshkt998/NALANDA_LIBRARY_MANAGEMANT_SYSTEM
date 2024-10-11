import express from "express";
import { mostBorrowedBooks,activeMembers,availableBooks } from "../controllers/reportControllers.js";

const router = express.Router();
router.get("/mostborrowed", mostBorrowedBooks);
router.get("/activemembers", activeMembers);
router.get("/bookavailability", availableBooks);

export default router;