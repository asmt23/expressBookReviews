const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
// check if the username exists in users
  if (username in users){
    return true;
  }

  return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
// check if username and password match the one we have in records.
  if (!isValid(username)){
    return false;
  }

  if (users[username] == password){
    return true;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
