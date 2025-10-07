import mongoose from "mongoose";


const TodoSchema = new mongoose.Schema({
title: { type: String, required: true },
description: { type: String, default: "" },
status: {
type: String,
enum: ["backlog", "wip", "pending", "done"],
default: "backlog",
},
createdAt: { type: Date, default: Date.now },
});


export default mongoose.models.Todo || mongoose.model("Todo", TodoSchema);