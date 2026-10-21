const ProjectCategory = require("../models/ProjectCategory")
const cloudinary = require("../cloudinary");

const syncResume = require("../resumeSync/resumeSync")

// Helper: extract Cloudinary public_id from URL
function getPublicId(url) {
    if (!url) return null;
    // e.g. https://res.cloudinary.com/cloud/image/upload/v123/portfolio/blog/abc.jpg
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    // Skip "upload" and version segment (v123)
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

// Helper: build validation error message object
function getErrorMessage(error) {
    let errorMessage = {}
    error.errors?.name ? errorMessage.name = error.errors.name.message : null
    error.errors?.pic ? errorMessage.pic = error.errors.pic.message : null
    return errorMessage
}

// Helper: send error response
function sendError(res, errorMessage) {
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

async function createRecord(req, res) {
    try {
        let data = new ProjectCategory(req.body)
        if (req.file) {
            data.pic = req.file.path
        }
        await data.save()
        await syncResume("projectCategories", data._id);
        res.send({
            result: "Done",
            data: data
        })
    } catch (error) {
        // remove the newly uploaded image since save failed
        if (req.file) await deleteFromCloudinary(req.file.path);

        sendError(res, getErrorMessage(error))
    }
}

async function getRecord(req, res) {
    try {
        let data = await ProjectCategory.find().sort({ _id: -1 })
        res.send({
            result: "Done",
            count: data.length,
            data: data
        })
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function getSingleRecord(req, res) {
    try {
        let data = await ProjectCategory.findOne({ _id: req.params._id })
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
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function updateRecord(req, res) {
    try {
        let data = await ProjectCategory.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.active = req.body.active ?? data.active
            if (req.file) {
                await deleteFromCloudinary(data.pic); // delete OLD image
                data.pic = req.file.path;             // set NEW image
            }
            await data.save()
            await syncResume("projectCategories", data._id);
            res.send({
                result: "Done",
                data: data
            })
        }
        else {
            // record not found, so remove the just-uploaded image
            if (req.file) await deleteFromCloudinary(req.file.path);
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
        }
    } catch (error) {
        // note: if the old image was already deleted before save failed, it can't be restored
        if (req.file) await deleteFromCloudinary(req.file.path);

        sendError(res, getErrorMessage(error))
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await ProjectCategory.findOne({ _id: req.params._id })
        if (data) {
            await deleteFromCloudinary(data.pic); // delete image from Cloudinary
            await data.deleteOne()
            await syncResume("projectCategories", data._id);
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