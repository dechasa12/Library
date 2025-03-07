const mongoose = require("mongoose");
const path = require("path");

const coverImageBasePath = "uploads/bookCovers"; // Define the storage path for cover images

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    publishDate: { type: Date, required: true },
    pageCount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    coverImageName: { type: String, required: true }, // Store only the filename
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
});
bookSchema.virtual("coverImagePath").get(function () {
    if (this.coverImageName) {
        return path.join("/", coverImageBasePath, this.coverImageName);
    }
});

module.exports = mongoose.model("Book", bookSchema); 
module.exports.coverImageBasePath = coverImageBasePath; 
