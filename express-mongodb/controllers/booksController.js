import { getDB } from "../config/db.js";

// 5. Insert one document into the books collection
export const insertOneBook = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection("books").insertOne(req.body);
    res.json({ acknowledged: result.acknowledged, insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 6. Insert multiple documents into the books collection (at least three records)
export const insertManyBooks = async (req, res) => {
  try {
    const db = getDB();
    const books = req.body;
    if (!Array.isArray(books) || books.length < 3) {
      return res
        .status(400)
        .json({ message: "Request body must be an array of at least three books." });
    }
    const result = await db.collection("books").insertMany(books);
    res.json({ acknowledged: result.acknowledged, insertedIds: result.insertedIds });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 8. Update the book with the given title, changing its year
export const updateBookYearByTitle = async (req, res) => {
  try {
    const db = getDB();
    const { title } = req.params;
    const { year } = req.body;
    const result = await db
      .collection("books")
      .updateOne({ title }, { $set: { year } });
    res.json({
      acknowledged: result.acknowledged,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 9. Find a book by title
export const findBookByTitle = async (req, res) => {
  try {
    const db = getDB();
    const { title } = req.query;
    const book = await db.collection("books").findOne({ title });
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 10. Find all books published between two years
export const findBooksByYearRange = async (req, res) => {
  try {
    const db = getDB();
    const from = Number(req.query.from);
    const to = Number(req.query.to);
    const books = await db
      .collection("books")
      .find({ year: { $gte: from, $lte: to } })
      .toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 11. Find books where the genre array includes a given genre
export const findBooksByGenre = async (req, res) => {
  try {
    const db = getDB();
    const { genre } = req.query;
    const books = await db.collection("books").find({ genres: genre }).toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 12. Skip the first two books, limit to the next three, sorted by year descending
export const skipLimitBooks = async (req, res) => {
  try {
    const db = getDB();
    const skip = Number(req.query.skip ?? 2);
    const limit = Number(req.query.limit ?? 3);
    const books = await db
      .collection("books")
      .find({})
      .sort({ year: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 13. Find books where the year field is stored as an integer (BSON type int)
export const findBooksWithIntegerYear = async (req, res) => {
  try {
    const db = getDB();
    const books = await db
      .collection("books")
      .find({ year: { $type: "int" } })
      .toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 14. Find all books whose genres do not include "Horror" or "Science Fiction"
export const findBooksExcludingGenres = async (req, res) => {
  try {
    const db = getDB();
    const books = await db
      .collection("books")
      .find({ genres: { $nin: ["Horror", "Science Fiction"] } })
      .toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 15. Delete all books published before a given year
export const deleteBooksBeforeYear = async (req, res) => {
  try {
    const db = getDB();
    const year = Number(req.query.year);
    const result = await db.collection("books").deleteMany({ year: { $lt: year } });
    res.json({ acknowledged: result.acknowledged, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 16. Aggregation: filter books published after 2000, sorted by year descending
export const aggregate1 = async (req, res) => {
  try {
    const db = getDB();
    const books = await db
      .collection("books")
      .aggregate([{ $match: { year: { $gt: 2000 } } }, { $sort: { year: -1 } }])
      .toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 17. Aggregation: books published after 2000, projecting only title/author/year
export const aggregate2 = async (req, res) => {
  try {
    const db = getDB();
    const books = await db
      .collection("books")
      .aggregate([
        { $match: { year: { $gt: 2000 } } },
        { $project: { _id: 0, title: 1, author: 1, year: 1 } },
      ])
      .toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 18. Aggregation: break the genres array into separate documents
export const aggregate3 = async (req, res) => {
  try {
    const db = getDB();
    const books = await db
      .collection("books")
      .aggregate([
        { $unwind: "$genres" },
        { $project: { _id: 0, title: 1, genres: 1 } },
      ])
      .toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 19. Aggregation: join the books collection with the logs collection
export const aggregate4 = async (req, res) => {
  try {
    const db = getDB();
    const logs = await db
      .collection("logs")
      .aggregate([
        {
          $lookup: {
            from: "books",
            localField: "book_id",
            foreignField: "_id",
            as: "book_details",
          },
        },
        {
          $project: {
            _id: 0,
            action: 1,
            book_details: {
              _id: 0,
              title: 1,
              author: 1,
              year: 1,
            },
          },
        },
      ])
      .toArray();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
