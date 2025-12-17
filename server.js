const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
app.use(cors());
app.use(express.json());

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB");
  }
}

connectDB();

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Note = mongoose.model("Note", noteSchema);

app.get("/note", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).send({ error: "Something went sideways." });
  }
});

app.post("/note/create", (req, res) => {
  const { title, content } = req.body;
  const note = new Note({ title, content });
  note.save();
  res.send(note);
});

app.delete("/note/delete/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const notes = await Note.findByIdAndDelete(id);
    res.json(notes);
  } catch (err) {
    res.status(500).send({ error: "Something went sideways." });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
