const mongoose = require("mongoose");

const AboutSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, "Name is Mandatory"] },
        heading: { type: String, required: [true, "Heading is Mandatory"] },
        subtitle: { type: String, required: [true, "Subtitle is Mandatory"] },
        shortDescription: { type: String, required: [true, "Short Description is Mandatory"] },
        longDescription: { type: String, required: [true, "Long Description is Mandatory"] },
        pic: { type: String, default: "" },
        resume: { type: String, default: "" },
        phone: { type: String, required: [true, "Phone Number is Mandatory"] },
        email: { type: String, required: [true, "Email Address is Mandatory"] },
        age: { type: Number, default: 0 },
        occupation: { type: String, default: "" },
        nationality: { type: String, default: "Indian" },
        yearExperience: { type: Number, default: 0 },
        projectsCompleted: { type: Number, default: 0 },
        programmingQuestions: { type: Number, default: 0 },
        instaLink: { type: String, default: "" },
        gitLink: { type: String, default: "" },
        linkidinLink: { type: String, default: "" },
        whatsapp: { type: String, default: "" },
    },
    { timestamps: true }
);

const About = mongoose.model("About", AboutSchema);
module.exports = About;