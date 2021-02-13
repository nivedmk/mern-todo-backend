const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/user.model");

const userRouter = express.Router();

userRouter.get("/me", auth, async (req, res) => {
  res.send(req.user);

  // try {
  //   const user = await User.find({});
  //   res.send(user);
  // } catch (e) {
  //   res.status(500).send(e);
  // }
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
    // console.log(error);
    res.status(400).send(e);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    ); // statics model methods

    if (!user) {
      return res.status(400).send({ error: "UnMatched credentials" });
    }
    const token = await user.generateAuthToken(); //methords or instance methode
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

userRouter.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send({ message: "Logout successfull" });
  } catch (e) {
    res.status(500).send({ message: "Something went wrong" });
  }
});

userRouter.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send({ Message: "Logout from all device" });
  } catch (e) {
    res.status(500).send({ message: "something went wrong" });
  }
});

userRouter.patch("/update/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", , "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Operation" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

userRouter.delete("/delete/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = userRouter;
