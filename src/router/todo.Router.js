const express = require("express");
const ToDo = require("../models/todo.model");

const toDorouter = express.Router();

toDorouter.get("/", async (req, res) => {
  await ToDo.find(function (err, todos) {
    if (err) {
      console.log(err);
    } else {
      res.json(todos);
    }
  });
});

toDorouter.get("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const toDo = await ToDo.findById({ _id });
    if (!toDo) {
      return res.status(404).send();
    }

    res.status(200).send(toDo);
  } catch (e) {
    res.status(500).send(e);
  }
});

toDorouter.post("/add", async (req, res) => {
  const toDo = new ToDo({
    ...req.body,
  });

  try {
    await toDo.save();
    res.status(201).send(toDo);
  } catch (e) {
    res.status(400).send(e);
  }
});

toDorouter.patch("/update/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "todo_description",
    "todo_responsible",
    "todo_priority",
    "todo_completed",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    // const todo = await ToDo.findByIdAndUpdate(req.params.id, req.body,{new: true, runValidators: true})
    // the above will update directly from mongodb. we need it from mongoose. mostly for user route pre --save--
    const toDo = await ToDo.findOne({ _id: req.params.id });

    if (!toDo) {
      return res.status(400).send();
    }

    updates.forEach((update) => (toDo[update] = req.body[update]));
    await toDo.save();
    res.send(toDo);
  } catch (e) {
    res.status(400).send(e);
  }
});

toDorouter.delete("/delete/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const todo = await ToDo.deleteOne({ _id: _id });
    if (todo.deletedCount != 0) {
      return res.status(202).send({ success: "Item deleted successfully" });
    } else {
      return res.status(400).send({ err: "Error on deleting" });
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

// todoRoutes.route('/update/:id').post(function (req, res) {
//   ToDo.findById(req.params.id, function (err, todo) {
//     if (!todo)
//       res.status(404).send('data is not found');
//     else
//       todo.todo_description = req.body.todo_description;
//     todo.todo_responsible = req.body.todo_responsible;
//     todo.todo_priority = req.body.todo_priority;
//     todo.todo_completed = req.body.todo_completed;

//     todo.save().then(todo => {
//       res.json('ToDo updated');
//     })
//       .catch(err => {
//         res.status(400).send("Update not possible");
//       });
//   });
// });

module.exports = toDorouter;
