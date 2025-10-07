import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import todosRouter from "./routes/TodoRoutes.js";


dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/todos", todosRouter);


const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;


mongoose
.connect(MONGODB_URI , {
    dbName: "skiilion-todo",
})
.then(() => {
console.log("Connected to MongoDB");
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => {
console.error("Mongo connection error:", err);
});