const mongoose = require("mongoose")

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Skill Category Name is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    },
})
const SkillCategory = new mongoose.model("SkillCategory", skillSchema)

module.exports = SkillCategory