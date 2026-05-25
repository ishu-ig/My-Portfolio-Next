const Portfolio = require("../models/Portfolio")
const cloudinary = require("../cloudinary");

const syncResume = require("../resumeSync/resumeSync")

// Helper: extract Cloudinary public_id from URL
function getPublicId(url) {
    if (!url) return null;
    // e.g. https://res.cloudinary.com/cloud/image/upload/v123/portfolio/blog/abc.jpg
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    // Skip version segment (v123)
    const pathParts = parts.slice(uploadIndex + 2);
    return pathParts.join("/").replace(/\.[^/.]+$/, ""); // remove extension
}

// Helper: delete from Cloudinary
async function deleteFromCloudinary(url) {
    const publicId = getPublicId(url);
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (e) { }
}

async function createRecord(req, res) {
    try {
        let data = new Portfolio(req.body)
        if (req.file) {
            data.pic = req.file.path
        }
        await data.save()
        await syncResume("projects", data._id);
        res.send({
            result: "Done",
            data: data
        })
    } catch (error) {

        if (req.file) await deleteFromCloudinary(req.file.path);
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })

        let errorMessage = {}
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.pic ? errorMessage.pic = error.errors.pic.message : null
        error.errors?.shortDescription ? errorMessage.shortDescription = error.errors.shortDescription.message : null
        error.errors?.longDescription ? errorMessage.longDescription = error.errors.longDescription.message : null
        error.errors?.category ? errorMessage.category = error.errors.category.message : null
        error.errors?.tech ? errorMessage.tech = error.errors.tech.message : null

        if (Object.values(errorMessage).length === 0) {
            res.status(500).send({
                result: "Fail",
                reason: "Internal Server Error"
            })
        }
        else {
            res.status(400).send({
                result: "Fail",
                reason: errorMessage
            })
        }
    }
}

async function getRecord(req, res) {
    try {
        let data = await Portfolio.find().sort({ _id: -1 })
        res.send({
            result: "Done",
            count: data.length,
            data: data
        })
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}


async function getSingleRecord(req, res) {
    try {
        let data = await Portfolio.findOne({ _id: req.params._id })
        if (data)
            res.send({
                result: "Done",
                data: data
            })
        else
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function updateRecord(req, res) {
    try {
        let data = await Portfolio.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.shortDescription = req.body.shortDescription ?? data.shortDescription
            data.longDescription = req.body.longDescription ?? data.longDescription
            data.category = req.body.category ?? data.category
            data.tech = req.body.tech ?? data.tech
            data.liveUrl = req.body.liveUrl ?? data.liveUrl
            data.githubRepo = req.body.githubRepo ?? data.githubRepo
            data.active = req.body.active ?? data.active
            // ✅ After
            if (req.file) {
                await deleteFromCloudinary(data.pic); // delete OLD image
                data.pic = req.file.path;             // set NEW image
            }
            await data.save()
            await syncResume("projects", data._id);
            res.send({
                result: "Done",
                data: data
            })
        }
        else
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
    } catch (error) {
        if (req.file) await deleteFromCloudinary(req.file.path);

        res.status(400).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Portfolio.findOne({ _id: req.params._id })
        if (data) {
             // Delete image from Cloudinary
        await deleteFromCloudinary(data.pic);
            await data.deleteOne()
            res.send({
                result: "Done",
                data: data
            })
        }
        else
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

module.exports = {
    createRecord: createRecord,
    getRecord: getRecord,
    getSingleRecord: getSingleRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord
}