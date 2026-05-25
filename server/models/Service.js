const mongoose = require("mongoose")

const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Name is Mendatory"]
    },
    icon: {
        type: String,
        required: [true, "Icon is Mendatory"]
    },
    shortDescription: {
        type: String,
        required: [true, "Short Description is Mendatory"]
    },
    longDescription: {
        type: String,
        required: [true, "Long Description is Mendatory"]
    },
    price: {
        type: Number,
        required: [true, "Price is Mendatory"]
    },
    duration: {
        type: String,
        required: [true, "Duration is Mendatory"]
    },
    category: {
        type: String,
        required:[true,"Category is Mendatory"]
    },
    technology: {
        type: String,
        required: [true, "Technology is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    }
    
})
const Service = new mongoose.model("Service", ServiceSchema)

module.exports = Service