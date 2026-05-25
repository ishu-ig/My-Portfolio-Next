const mongoose = require("mongoose")

const PortfolioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Portfolio Name is Mendatory"]
    },
    pic: {
        type: String,
        required: [true, "Portfolio Pic is Mendatory"]
    },
    shortDescription: {
        type: String,
        required: [true, "Short Description is Mendatory"]
    },
    longDescription: {
        type: String,
        required: [true, "Long Description is Mendatory"]
    },
    category: {
        type: String,
        required: [true, "Category is Mendatory"]
    },
    tech:{
        type:String,
        required:[true,"Tech Choice Is Mendatory"]
    },
    liveUrl :{
        type :String,
        default:""
    },
    githubRepo:{
        type :String,
        default:""
    },
    
    active: {
        type: Boolean,
        default: true
    },
})
const Portfolio = new mongoose.model("Portfolio", PortfolioSchema)

module.exports = Portfolio