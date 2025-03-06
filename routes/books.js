const express = require("express");
const router = express.Router();
const path = require("path");
const Book = require('../models/book');
const Author = require('../models/author');
const multer = require('multer');

// Define the upload path for book cover images
const uploadPath = path.join('public', Book.coverImageBasePath);

// Allowed image mime types for book covers
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

// Set up multer for file uploads
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        // Check file type
        callback(null, imageMimeTypes.includes(file.mimetype));
    }
});

// All Books route
router.get('/', async (req, res) => {
    try {
        const books = await Book.find({}).populate('author'); // Retrieve all books and populate author
        res.render('books/index', { books });
    } catch (error) {
        res.redirect('/');
    }
});

// New Book route
router.get('/new', async (req, res) => {
    try {
        const authors = await Author.find({}); // Fetch all authors
        const book = new Book(); // Create an empty book object
        res.render("books/new", { book, authors });
    } catch (error) {
        res.redirect('/books');
    }
});

// Create Book route
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file ? req.file.filename : null; // If a file was uploaded, get its filename
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        coverImage: fileName, // Save the filename of the uploaded cover image
        pageCount: req.body.pageCount,
        description: req.body.description,
    });

    try {
        const newBook = await book.save(); // Save the new book
        res.redirect(`/books/${newBook.id}`); // Redirect to the new book's page
    } catch (e) {
        // Handle error if saving book fails
        if (book.coverImage) {
            removeBookCover(book.coverImage); // Remove cover image if an error occurs
        }
        res.render('books/new', {
            book: book,
            errorMessage: "Error creating Book",
        });
    }
});

module.exports = router;
