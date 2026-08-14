const mongoose = require("mongoose")

const PortfolioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Portfolio Name is Mandatory"]
    },
    // ✅ Changed from String to [String] for multiple images
    pic: {
        type: [String],
        validate: {
            validator: function (arr) { return arr && arr.length > 0; },
            message: "At least one portfolio image is required"
        }
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
    tech: {
        type: String,
        required: [true, "Tech Choice Is Mandatory"]
    },
    liveUrl: {
        type: String,
        default: ""
    },
    githubRepo: {
        type: String,
        default: ""
    },
    active: {
        type: Boolean,
        default: true
    },
})

const Portfolio = new mongoose.model("Portfolio", PortfolioSchema)

module.exports = Portfolio