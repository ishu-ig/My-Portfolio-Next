const Resume = require("../models/Resume");

async function getResume(req, res) {
    try {
        let resume = await Resume.findOne()
            .populate("skills")
            .populate("education")
            .populate("experience")
            .populate("projects")
            .populate("certificates")
            .populate("services");

        if (!resume) {
            return res.status(404).send({
                result: "Fail",
                message: "No resume found"
            });
        }

        // --- BUILD ABOUT SECTION WITH ONLY NAMES ---
        const about = {
            summary: resume.about.summary,

            skills: resume.skills.map(s => s.name),
            education: resume.education.map(e => e.degreeName),
            experience: resume.experience.map(ex =>  ex.companyName),
            projects: resume.projects.map(p => p.name || p.title),
            certificates: resume.certificates.map(c => c.name || c.title),
            services: resume.services.map(s => s.name)
        };

        // --- FINAL RESPONSE ---
        res.send({
            result: "Done",
            data: {
                ...resume._doc,
                about   // replace with refined one
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).send({
            result: "Fail",
            message: "Internal Server Error"
        });
    }
}

module.exports = getResume;
