const express = require("express");
const router = express.Router();
const Author = require('../models/author');
//All authors route
router.get('/', async (req, res) => {
    let searchOptions = { name: "" }; // ✅ Ensure searchOptions always has a default value

    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = req.query.name; // Store input text
    }

    try {
        const authors = await Author.find({
            name: new RegExp(req.query.name || "", 'i') // Case-insensitive search
        });

        res.render("authors/index", { authors: authors, searchOptions: searchOptions }); // ✅ Pass searchOptions
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});
//New Author routes
router.get('/new', (req, res) => {
    res.render("authors/new",{author: new Author});
});

//Create Author routes
router.post('/', async(req, res) => {
    const author = new Author({
        name:req.body.name
    })
    try{
 const newAuthor = await author.save();
 //res.redirect('authors/${newAuthor.id}');
 res.redirect('authors');
    }catch{
        res.render('authors/new',{
        author: author,
        errorMessage: "Error creating Author"
    })
}
});
module.exports = router;   