const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({

    // ⭐ ABOUT SECTION (STATIC)
    about: {
        summary: { type: String, required: true },

        skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
        education: [{ type: mongoose.Schema.Types.ObjectId, ref: "Education" }],
        experience: [{ type: mongoose.Schema.Types.ObjectId, ref: "Experience" }],
        projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Portfolio" }],
        certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Certificate" }],
        services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }]
    },

    // ⭐ CONTACT SECTION (STATIC)
    contact: {
        email: { type: String, required: true },
        github: { type: String, required: true },
        linkedin: { type: String, required: true },
        portfolio: { type: String, required: true }
    },

    // ⭐ SKILLS
    skills: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
            required: true
        }
    ],

    // ⭐ EDUCATION
    education: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Education",
            required: true
        }
    ],

    // ⭐ EXPERIENCE
    experience: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Experience"
        }
    ],

    // ⭐ PROJECTS
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Portfolio",
            required: true
        }
    ],

    // ⭐ CERTIFICATES
    certificates: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Certificate"
        }
    ],

    // ⭐ SERVICES
    services: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service"
        }
    ],

    active: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Resume", ResumeSchema);
