const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let users_name = users.filter((user)=>{
      return user.username === username
    });
    if(users_name.length > 0){
      return true;
    } else {
      return false;
    }
  }

const authenticatedUser = (username,password)=>{ //returns boolean
// check if username and password match the one we have in records.
  if (!isValid(username)){
    return false;
  }

  let users_name = users.filter((user)=>{
    return user.username === username &&
    user.password === password;
  });

  return (users_name.length > 0);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    
    const isbn = req.params.isbn;
    const username = req.session.authorization["username"];
    const review = req.body.review;

    if (!(isbn in books))
    {
        return res.status(404).json({message: "ISBN doesn't exist!"});
    }
    
    const book = books[isbn];
    const review_dict = book["reviews"];
    review_dict[username] = review;

    return res.status(200).send("Successfully added review!");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization["username"];

    if (!(isbn in books))
    {
        return res.status(404).json({message: "ISBN doesn't exist!"});
    }
    
    const book = books[isbn];
    const review_dict = book["reviews"];
    delete review_dict[username];

    return res.status(200).send("Successfully deleted review!");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
