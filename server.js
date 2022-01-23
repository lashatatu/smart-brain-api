const express = require("express");
const app = express();
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex=require("knex")

const db=knex({
  client:"pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "heydrich",
    database: "smart-brain"
  }
});

db.select("*").from("users").then(data=>{
  console.log(data);
});

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json("success");
  } else {
    res.status(400).json("error logging in");
  }
  res.json("signing");
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  db('users')
  .returning('*')
  .insert({
    email: email,
    name: name,
    joined: new Date()
  })
    .then(user=>{
      res.json(user[0])
  })
    .catch(err=>res.status(400).json('unable to register'))
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(404).json("no user found");
  }
});

app.post("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });

  if (!found) {
    res.status(404).json("no user found");
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
