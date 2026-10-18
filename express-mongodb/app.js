import express from "express";

import collectionsRoutes from "./routes/collectionsRoutes.js";
import booksRoutes from "./routes/booksRoutes.js";
import logsRoutes from "./routes/logsRoutes.js";

const app = express();
app.use(express.json());

app.use("/collection", collectionsRoutes);
app.use("/books", booksRoutes);
app.use("/logs", logsRoutes);

export default app;
