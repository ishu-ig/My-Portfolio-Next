const mongoose = require("mongoose")

const ExperienceSchema = new mongoose.Schema({

    jobTitle: {
        type: String,
        required:[true,"Job Title Is Mendatory"]
    },
    companyName: {
        type: String,
        required:[true,"Company Name Is Required"]
    },
    startDate: {
        type: String,
        required:[true,"Start Date Is Mendatory"]
    },
    endDate: {
        type: String,
        required:[true,"End Date Is Mendatory"]
    },
    description:{
        type:String,
        required:[true,"Description Is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    },
})
const Experience = new mongoose.model("Experience", ExperienceSchema)

module.exports = Experience