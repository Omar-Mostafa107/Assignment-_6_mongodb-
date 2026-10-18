import express from "express";
import {
  createBooksCollection,
  createAuthorsImplicit,
  createLogsCapped,
  createBooksTitleIndex,
} from "../controllers/collectionsController.js";

const router = express.Router();

router.post("/books", createBooksCollection);
router.post("/authors", createAuthorsImplicit);
router.post("/logs/capped", createLogsCapped);
router.post("/books/index", createBooksTitleIndex);

export default router;
