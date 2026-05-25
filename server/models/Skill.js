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