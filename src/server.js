require("./db/mongoDB");
const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT | 4000;

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});

// const main = async () => {
//   const User = require("./models/user.model");
//   const ToDo = require("./models/todo.model");
//   const user = await User.findById("60278256c1a2d135e844322f");
//   await user.populate("todos").execPopulate();
//   console.log(user.tasks);

//   // const todo = await ToDo.findById("60278263c1a2d135e8443231");
//   // await todo.populate("owner").execPopulate();
//   // console.log(todo.owner);
// };
// main();
