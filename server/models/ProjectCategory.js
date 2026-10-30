const mongoose = require("mongoose")

const ProjectCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Project Category Name is Mandatory"]
    },
    active: {
        type: Boolean,
        default: true
    },
})
const ProjectCategory = new mongoose.model("ProjectCategory", ProjectCategorySchema)

module.exports = ProjectCategory