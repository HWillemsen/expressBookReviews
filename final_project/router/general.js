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
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        return res.status(200).json(response.data);
      } catch (err) {
        return res.status(500).json({ message: "Error fetching books", error: err.message });
      }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return res.status(200).json(response.data);
      } catch (err) {
        return res.status(404).json({ message: "Book not found", error: err.message });
      }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    try {
        const author = encodeURIComponent(req.params.author);
        const response = await axios.get(`${BASE_URL}/author/${author}`);
        return res.status(200).json(response.data);
      } catch (err) {
        return res.status(404).json({ message: "No books found for this author", error: err.message });
      }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = encodeURIComponent(req.params.title);
        const response = await axios.get(`${BASE_URL}/title/${title}`);
        return res.status(200).json(response.data);
      } catch (err) {
        return res.status(404).json({ message: "No books found for this title", error: err.message });
      }
});

//  Get book review
public_users.get("/review/:isbn",(req,res)=>{
  // Retrieve the isbn parameter from the request URL and send the corresponding book's details
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
