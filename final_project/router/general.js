const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get("/",(req,res)=>{
	// Send JSON response with formatted books data
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn",(req,res)=>{
  // Retrieve the isbn parameter from the request URL and send the corresponding book's details
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author",(req,res)=>{
  // Retrieve the author parameter from the request URL
  // and send the corresponding book's details
  const author = req.params.author;
  for (let key in books) {
    if (books[key].author === author) {
      return res.send(books[key]);
    }
  }
  return res.status(404).json({message: "Book not found"});
});

// Get all books based on title
public_users.get("/title/:title",(req,res)=>{
  // Retrieve the title parameter from the request URL
  // and send the corresponding book's details
  const title = req.params.title;
  for (let key in books) {
    if (books[key].title === title) {
      return res.send(books[key]);
    }
  }
  return res.status(404).json({message: "Book not found"});
});

//  Get book review
public_users.get("/review/:isbn",(req,res)=>{
  // Retrieve the isbn parameter from the request URL and send the corresponding book's details
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
