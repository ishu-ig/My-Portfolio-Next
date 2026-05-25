const mongoose = require("mongoose")

const EducationSchema = new mongoose.Schema({

    degreeName: {
        type: String,
        required:[true,"Job Title Is Mendatory"]
    },
    instituteName: {
        type: String,
        required:[true,"Company Name Is Required"]
    },
    startDate: {
        type: String,
        required:[true,"Start Date Is Mendatory"]
    },
    endDate: {
        type: String,
        default:""
    },
    description:{
        type:String,
        required:[true,"Description Is Required"]
    },
    cgpa:{
        type:String,
        default:''
    },
    active: {
        type: Boolean,
        default: true
    },
    
})
const Education = new mongoose.model("Education", EducationSchema)

module.exports = Education