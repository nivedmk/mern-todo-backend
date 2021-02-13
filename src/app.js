const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const toDorouter = require("./router/todo.Router");
const userRouter = require("./router/user.Router");

app.use(cors());
app.use(bodyParser.json());
app.use("/todos", toDorouter);
app.use("/users", userRouter);

module.exports = app;
