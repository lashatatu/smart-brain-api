const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controlers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "heydrich",
    database: "smart-brain",
  },
});

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("success");
});

// signin
app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

// register
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

// profile
app.get("/profile/:id", (req, res) => {
  profile.handleProfile(req, res, db);
});

// image
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
