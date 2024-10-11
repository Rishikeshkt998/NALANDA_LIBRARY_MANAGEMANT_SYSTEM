import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { addBook,updateBook,deleteBook,listBooks} from "../controllers/bookControllers.js";

const router = express.Router();

router.post("/addbook", protect(["Admin"]), addBook);
router.put("/updatebook/:id", protect(["Admin"]), updateBook);
router.delete("/deletebook/:id", protect(["Admin"]), deleteBook);
router.get("/", listBooks);

export default router;