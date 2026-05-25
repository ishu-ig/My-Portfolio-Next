const Resume = require("../models/Resume");

async function syncResume(section, id) {
    try {
        const allowedSections = [
            "skills",
            "education",
            "experience",
            "projects",
            "certificates",
            "services"
        ];

        if (!allowedSections.includes(section)) {
            throw new Error(`Invalid resume section: ${section}`);
        }

        let resume = await Resume.findOne();

        // ⛔ Resume not created → create with ALL about fields
        if (!resume) {
            resume = await Resume.create({
                about: {
                    summary: "I am Ishaan Gupta, a MERN Developer.",
                    skills: [],
                    education: [],
                    experience: [],
                    projects: [],
                    certificates: [],
                    services: []        // ⭐ ensure exists
                },
                contact: {
                    email: "ishaanguptacse@gmail.com",
                    github: "https://github.com/",
                    linkedin: "https://linkedin.com/",
                    portfolio: "https://portfolio.com/"
                },
                skills: [],
                education: [],
                experience: [],
                projects: [],
                certificates: [],
                services: []
            });
        }

        // ⭐ FIX: Ensure nested about fields ALWAYS exist
        if (!resume.about[section]) {
            resume.about[section] = [];   // ← Create missing array
        }

        // Add ID to main section
        if (!resume[section].includes(id)) {
            resume[section].push(id);
        }

        // Add ID inside ABOUT section
        if (!resume.about[section].includes(id)) {
            resume.about[section].push(id);
        }

        await resume.save();
        return resume;

    } catch (err) {
        console.log("Resume Sync Error:", err.message || err);
    }
}

module.exports = syncResume;
