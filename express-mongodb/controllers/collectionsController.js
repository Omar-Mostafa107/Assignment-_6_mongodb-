import { getDB } from "../config/db.js";

// 1. Create an explicit "books" collection with a validation rule
export const createBooksCollection = async (req, res) => {
  try {
    const db = getDB();
    await db.createCollection("books", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title"],
          properties: {
            title: {
              bsonType: "string",
              minLength: 1,
              description: "title must be a non-empty string and is required",
            },
          },
        },
      },
    });
    res.json({ ok: 1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Create an implicit "authors" collection by inserting data directly
export const createAuthorsImplicit = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection("authors").insertOne(req.body);
    res.json({ acknowledged: result.acknowledged, insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Create a capped collection named "logs" with a size limit of 1MB
export const createLogsCapped = async (req, res) => {
  try {
    const db = getDB();
    await db.createCollection("logs", {
      capped: true,
      size: 1048576, // 1MB
    });
    res.json({ ok: 1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Create an index on the books collection for the title field
export const createBooksTitleIndex = async (req, res) => {
  try {
    const db = getDB();
    const indexName = await db.collection("books").createIndex({ title: 1 });
    res.json(indexName);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
