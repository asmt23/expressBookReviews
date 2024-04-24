const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

  if (!req.body.username){
    return res.status(403).json({message: "Please provide a username!"});
  }
  const us = req.body.username;
  if (!req.body.password){
    return res.status(403).json({message: "Please provide a password!"});
  }
  const pwd = req.body.password;
  
  if (users.hasOwnProperty(us)){
    return res.status(403).json({message: "User already exists!"});
  }

  users[us] = pwd;

  return res.status(200).json({message: "User registered!"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Send all books
  return res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // get book based on isbn
  const isb = req.params.isbn;
  book = null;
    for (key in books){
        if (key == isb){
            book = books[isb];
        }
    }
    return res.send(JSON.stringify(book,null,4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
   // get book based on isbn
   const auth = req.params.author;
   const book_auth = [];
     for (key in books){
         if (books[key].author == auth) {
            book_auth.push(books[key]);
         }
     }
     return res.send(JSON.stringify({book_auth}, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const ttl = req.params.title;
    const book_ttl = [];
      for (key in books){
          if (books[key].title == ttl) {
             book_ttl.push(books[key]);
          }
      }
      return res.send(JSON.stringify({book_ttl}, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // get isbn
    const isb = req.params.isbn;
    book_review = null;
      for (key in books){
          if (key == isb){
              book_title = books[isb].title;
              book_review = books[isb].reviews;
          }
      }

      return res.send(JSON.stringify({book_title, book_review}, null, 4));
});

module.exports.general = public_users;
