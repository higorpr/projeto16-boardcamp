import express, { json } from "express";
import cors from "cors";
import { connection } from "./database/db.js";
import router from "./routes/index.js";

const app = express();
app.use(cors());
app.use(json());
app.use(router);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`App server running on port ${port}`));
