// the server entry point
import express from "express";
import cors from "cors";
import "dotenv/config";
import { router as api } from "./routes";

const app = express();

// allow your frontend  to use default
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// API routes
app.use("/api", api);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
});
