const About = require("../models/About");
const cloudinary = require("../cloudinary");

function getPublicId(url) {
    if (!url) return null;
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    const pathParts = parts.slice(uploadIndex + 1);
    const withoutVersion = pathParts[0]?.match(/^v\d+$/) ? pathParts.slice(1) : pathParts;
    return withoutVersion.join("/").replace(/\.[^/.]+$/, "");
}

async function deleteFromCloudinary(url) {
    const publicId = getPublicId(url);
    if (!publicId) return;
    try { await cloudinary.uploader.destroy(publicId); } catch (e) {}
}

function extractValidationErrors(error) {
    const fields = ["name", "heading", "subtitle", "shortDescription", "longDescription", "phone", "email"];
    const errorMessage = {};
    for (const field of fields) {
        if (error.errors?.[field]) errorMessage[field] = error.errors[field].message;
    }
    return errorMessage;
}

async function createRecord(req, res) {
    try {
        let data = new About(req.body);
        if (req.files?.pic)    data.pic    = req.files.pic[0].path;
        if (req.files?.resume) data.resume = req.files.resume[0].path;
        await data.save();
        res.send({ result: "Done", data });
    } catch (error) {
        if (req.files?.pic)    await deleteFromCloudinary(req.files.pic[0].path);
        if (req.files?.resume) await deleteFromCloudinary(req.files.resume[0].path);
        const errorMessage = extractValidationErrors(error);
        if (Object.keys(errorMessage).length === 0)
            return res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
        res.status(400).send({ result: "Fail", reason: errorMessage });
    }
}

async function getRecord(req, res) {
    try {
        let data = await About.find().sort({ _id: -1 });
        res.send({ result: "Done", count: data.length, data });
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

async function getSingleRecord(req, res) {
    try {
        let data = await About.findById(req.params._id);
        if (data) res.send({ result: "Done", data });
        else res.status(404).send({ result: "Fail", reason: "Record Not Found" });
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

async function updateRecord(req, res) {
    try {
        let data = await About.findById(req.params._id);
        if (!data) return res.status(404).send({ result: "Fail", reason: "Record Not Found" });

        // FIX: added instaLink, gitLink, linkidinLink to updatable fields
        const fields = [
            "name", "heading", "subtitle", "shortDescription", "longDescription",
            "phone", "email", "age", "occupation", "nationality",
            "yearExperience", "projectsCompleted", "programmingQuestions",
            "instaLink", "gitLink", "linkidinLink",
        ];
        for (const field of fields) {
            if (req.body[field] !== undefined) data[field] = req.body[field];
        }

        if (req.files?.pic) {
            if (data.pic) await deleteFromCloudinary(data.pic);
            data.pic = req.files.pic[0].path;
        }
        if (req.files?.resume) {
            if (data.resume) await deleteFromCloudinary(data.resume);
            data.resume = req.files.resume[0].path;
        }

        await data.save();
        res.send({ result: "Done", data });
    } catch (error) {
        if (req.files?.pic)    await deleteFromCloudinary(req.files.pic[0].path);
        if (req.files?.resume) await deleteFromCloudinary(req.files.resume[0].path);
        const errorMessage = extractValidationErrors(error);
        if (Object.keys(errorMessage).length === 0)
            return res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
        res.status(400).send({ result: "Fail", reason: errorMessage });
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await About.findById(req.params._id);
        if (!data) return res.status(404).send({ result: "Fail", reason: "Record Not Found" });
        if (data.pic)    await deleteFromCloudinary(data.pic);
        if (data.resume) await deleteFromCloudinary(data.resume);
        await data.deleteOne();
        res.send({ result: "Done", data });
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

module.exports = { createRecord, getRecord, getSingleRecord, updateRecord, deleteRecord };