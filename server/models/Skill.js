const mongoose = require("mongoose")

const SkillSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Skill Name is Mendatory"]
    },
    description: {
        type: String,
        required: [true, "Description is Mendatory"]
    },
    icon: {
        type: String,
        default: ""   // Bootstrap icon class e.g. "bi bi-code-slash" or image URL
    },
    level: {
        type: Number,
        required: [true, "Level is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    },
})
const Skill = new mongoose.model("Skill", SkillSchema)

module.exports = Skill