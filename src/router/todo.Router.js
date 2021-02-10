const express = require('express');
const ToDo = require('../models/todo.model');
const Todo = require('../models/todo.model');

const toDorouter = express.Router();

toDorouter.get('/', async (req, res) => {
    await Todo.find(function (err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
})

toDorouter.get('/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const toDo = await Todo.findById({ _id })
        if (!toDo) {
            return res.status(404).send()
        }

        res.send(toDo)
    } catch (e) {
        res.status(500).send()
    }
})

toDorouter.post('/add', async (req, res) => {
    const toDo = new ToDo({
        ...req.body
    })

    try {
        await toDo.save()
        res.status(201).send(toDo).json({ 'todo': 'todo added successfully' });
    } catch (e) {
        res.status(400).send(e)
    }
})

toDorouter.put('/update/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['todo_description', 'todo_responsible', 'todo_priority', 'tod;o_completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    try {
        const toDo = await ToDo.findOne({ _id: req.params.id })

        if (!toDo) {
            return res.status(400).send()
        }

        updates.forEach(update => toDo[update] = req.body[update])
        await toDo.save()
        res.send(toDo)
    } catch (e) {
        res.send(400).send(e)
    }
})

// todoRoutes.route('/update/:id').post(function (req, res) {
//   Todo.findById(req.params.id, function (err, todo) {
//     if (!todo)
//       res.status(404).send('data is not found');
//     else
//       todo.todo_description = req.body.todo_description;
//     todo.todo_responsible = req.body.todo_responsible;
//     todo.todo_priority = req.body.todo_priority;
//     todo.todo_completed = req.body.todo_completed;

//     todo.save().then(todo => {
//       res.json('Todo updated');
//     })
//       .catch(err => {
//         res.status(400).send("Update not possible");
//       });
//   });
// });

module.exports = toDorouter