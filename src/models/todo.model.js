const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let TodoSchema = new Schema({
  todo_description: {
    required: true,
    type: String,
  },
  todo_responsible: {
    required: true,
    type: String,
  },
  todo_priority: {
    required: true,
    type: String,
  },
  todo_completed: {
    required: true,
    type: Boolean,
  },
});

const ToDo = mongoose.model("Todo", TodoSchema);

module.exports = ToDo;
