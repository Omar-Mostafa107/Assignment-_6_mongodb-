import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

// 7. Insert a new log into the logs collection
export const insertLog = async (req, res) => {
  try {
    const db = getDB();
    const { book_id, action } = req.body;
    const log = {
      book_id: ObjectId.isValid(book_id) ? new ObjectId(book_id) : book_id,
      action,
    };
    const result = await db.collection("logs").insertOne(log);
    res.json({ acknowledged: result.acknowledged, insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
