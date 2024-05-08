const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesUserExist = (username)=>{
    let users_name = users.filter((user)=>{
      return user.username === username
    });
    if(users_name.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesUserExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User registered!"});
      } else {
        return res.status(403).json({message: "User already exists!"});
      }
    }
    return res.status(403).json({message: "Registration failed!"});
  });

  let getBooksPromise = new Promise((resolve,reject) => {
    let book_list = books;
    resolve(book_list);
    });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
    // Send all books
  getBooksPromise.then((book_list) => {
    res.send(JSON.stringify({book_list},null,4));
});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // get book based on isbn
  const isb = req.params.isbn;
  getBooksPromise.then((book_list) => {
    let book = null;
    for (key in book_list){
        if (key == isb){
            book = book_list[isb];
            res.send(JSON.stringify(book,null,4));
        }
    }

    if (book == null)
    {
        res.status(404).json({message: "Book with this ISBN not found! Try again."});
    }
  });    
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
   // get book based on isbn
   const auth = req.params.author;
   
   getBooksPromise.then((book_list) => {
    const book_auth = [];
     for (key in book_list){
         if (book_list[key].author == auth) {
            book_auth.push(book_list[key]);
         }
     }
     if (book_auth.length > 0)
     {
        res.send(JSON.stringify({book_auth}, null, 4));
     }
     else {
        res.status(404).json({message: "Books by this author not found! Try again."});
     }
  })   
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const ttl = req.params.title;
    getBooksPromise.then((book_list) => {
        const book_ttl = [];
        for (key in book_list){
            if (book_list[key].title == ttl) {
               book_ttl.push(book_list[key]);
            }
        }
        if (book_ttl.length > 0)
        {
            res.send(JSON.stringify({book_ttl}, null, 4));
        }
        else {
            res.status(404).json({message: "Book not found! Try again."});
        }
      });
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
