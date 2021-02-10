const mongoose = require('mongoose');
const app = require('./app')
require('dotenv').config();

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function () {
  console.log("MongoDB database connection established successfully");
})

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});