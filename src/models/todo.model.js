const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let TodoSchema = new Schema({
  todo_description: {
    required: true,
    type: String,
    trim: true,
  },
  todo_responsible: {
    required: true,
    type: String,
    trim: true,
  },
  todo_priority: {
    required: true,
    type: String,
    trim: true,
  },
  todo_completed: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const ToDo = mongoose.model("ToDo", TodoSchema);

module.exports = ToDo;
