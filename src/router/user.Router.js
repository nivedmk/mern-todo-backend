const express = require("express");
const User = require("../models/user.model");

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

userRouter.get("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById({ _id });
    if (!user) {
      return res.status(404).send();
    }

    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

userRouter.post("/add", async (req, res) => {
  const user = new User({
    ...req.body,
  });

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    console.log(error);
    res.status(400).send(e);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    ); // statics model methods
    const token = await user.generateAuthToken(); //methords or instance methode
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

userRouter.patch("/update/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", , "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Operation" });
  }

  try {
    const user = await User.findById({ _id: req.params.id });

    if (!user) return res.status(400).send({ error: "User not found" });

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

userRouter.delete("/delete/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.deleteOne({ _id: _id });
    if (user.deletedCount != 0) {
      return res.status(202).send({ success: "Item deleted successfully" });
    } else {
      return res.status(400).send({ err: "Error on deleting" });
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = userRouter;
