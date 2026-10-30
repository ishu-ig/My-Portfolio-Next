const mongoose = require("mongoose")

const PortfolioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Portfolio Name is Mandatory"]
    },
    pic: {
        type: [String],
        validate: {
            validator: function (arr) { return arr && arr.length > 0; },
            message: "At least one portfolio image is required"
        }
    },
    projectCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProjectCategory",
        required: [true, "Project Category is Mandatory"]
    },
    shortDescription: {
        type: String,
        required: [true, "Short Description is Mandatory"]
    },
    longDescription: {
        type: String,
        required: [true, "Long Description is Mandatory"]
    },
    // Legacy text field: replaced by projectCategory, kept optional so old records still load
    category: {
        type: String,
        default: ""
    },
    tech: {
        type: String,
        required: [true, "Tech Choice Is Mandatory"]
    },
    liveUrl: { type: String, default: "" },
    adminUrl: { type: String, default: "" },
    githubRepo: { type: String, default: "" },
    active: { type: Boolean, default: true },
})

const Portfolio = new mongoose.model("Portfolio", PortfolioSchema)

module.exports = Portfolio