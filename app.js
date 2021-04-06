//jshint esversion:6
// Initialise addons.
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app= express();
// Custom settings on addons.
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/userDB");


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true}));
// setting up schemas.
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// join a plugin to the schema. ALWAYS use plugin BEFORE defining the mongoose.model!
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});
// create mongoose model
const User = new mongoose.model("User", userSchema);
// Set diferent routes of access.
app.get("/", function(req, res){
  res.render("home");
});

app.get("/register", function(req, res){
  res.render("register");
});
app.get("/login", function(req, res){
  res.render("login");
});
// POST responses.
app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (!err){
      res.render("secrets");
    } else {
      res.send("There was an error: " + err)
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (!err){
      if (foundUser){
        if(foundUser.password = password) {
          res.render("secrets");
        }
      }
    }
  });
});

// Server starts listening for commands/paths.
app.listen(3000, function(){
  console.log("Server started on port 3000.");
})
