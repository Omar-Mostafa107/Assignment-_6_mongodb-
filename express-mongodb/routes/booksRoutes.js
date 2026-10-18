import express from "express";
import {
  insertOneBook,
  insertManyBooks,
  updateBookYearByTitle,
  findBookByTitle,
  findBooksByYearRange,
  findBooksByGenre,
  skipLimitBooks,
  findBooksWithIntegerYear,
  findBooksExcludingGenres,
  deleteBooksBeforeYear,
  aggregate1,
  aggregate2,
  aggregate3,
  aggregate4,
} from "../controllers/booksController.js";

const router = express.Router();

router.post("/batch", insertManyBooks);
router.post("/", insertOneBook);

router.get("/title", findBookByTitle);
router.get("/year", findBooksByYearRange);
router.get("/genre", findBooksByGenre);
router.get("/skip-limit", skipLimitBooks);
router.get("/year-integer", findBooksWithIntegerYear);
router.get("/exclude-genres", findBooksExcludingGenres);
router.get("/aggregate1", aggregate1);
router.get("/aggregate2", aggregate2);
router.get("/aggregate3", aggregate3);
router.get("/aggregate4", aggregate4);

router.delete("/before-year", deleteBooksBeforeYear);

router.patch("/:title", updateBookYearByTitle);

export default router;
