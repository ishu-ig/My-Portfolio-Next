const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Blog Title is Mandatory"]
    },

    pic: {
        type: String,
        required: [true, "Blog Thumbnail Image is Mandatory"]
    },

    shortDescription: {
        type: String,
        required: [true, "Short Description is Mandatory"]
    },

    longDescription: {
        type: String,
        required: [true, "Long Description is Mandatory"]
    },

    category: {
        type: String,
        required: [true, "Category is Mandatory"]
    },

    tags: {
        type: String,
        default: ""
    },

    author: {
        type: String,
        required: [true, "Author Name is Mandatory"],
        default: "Admin"
    },

    date: {
        type: String,
        default: new Date().toLocaleDateString()
    },

    active: {
        type: Boolean,
        default: true
    }
});

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
