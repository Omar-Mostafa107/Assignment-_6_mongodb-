import express from "express";
import { insertLog } from "../controllers/logsController.js";

const router = express.Router();

router.post("/", insertLog);

export default router;
