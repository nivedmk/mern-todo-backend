const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const toDorouter = require('./router/todo.Router')

app.use(cors());
app.use(bodyParser.json());
app.use('/todos', toDorouter)

module.exports = app;