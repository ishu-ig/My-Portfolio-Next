const Portfolio = require("../models/Portfolio")
const cloudinary = require("../cloudinary");
const syncResume = require("../resumeSync/resumeSync")

// Helper: extract Cloudinary public_id from URL
function getPublicId(url) {
    if (!url) return null;
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    const pathParts = parts.slice(uploadIndex + 2); // skip version segment
    return pathParts.join("/").replace(/\.[^/.]+$/, "");
}

// Helper: delete a single image from Cloudinary
async function deleteFromCloudinary(url) {
    const publicId = getPublicId(url);
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (e) { }
}

// Helper: delete multiple images from Cloudinary
async function deleteAllFromCloudinary(urls = []) {
    await Promise.all(urls.map(deleteFromCloudinary));
}

// ─── CREATE ──────────────────────────────────────────────────────────────────
async function createRecord(req, res) {
    try {
        let data = new Portfolio(req.body)

        // ✅ Multiple images: req.files is an array
        if (req.files && req.files.length > 0) {
            data.pic = req.files.map(f => f.path);
        }

        await data.save()
        await syncResume("projects", data._id);

        res.send({ result: "Done", data })
    } catch (error) {
        // Rollback uploaded images on failure
        if (req.files) await deleteAllFromCloudinary(req.files.map(f => f.path));

        let errorMessage = {}
        error.errors?.name             && (errorMessage.name             = error.errors.name.message)
        error.errors?.pic             && (errorMessage.pic             = error.errors.pic.message)
        error.errors?.shortDescription && (errorMessage.shortDescription = error.errors.shortDescription.message)
        error.errors?.longDescription  && (errorMessage.longDescription  = error.errors.longDescription.message)
        error.errors?.category         && (errorMessage.category         = error.errors.category.message)
        error.errors?.tech             && (errorMessage.tech             = error.errors.tech.message)

        if (Object.values(errorMessage).length === 0) {
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
        } else {
            res.status(400).send({ result: "Fail", reason: errorMessage })
        }
    }
}

// ─── GET ALL ─────────────────────────────────────────────────────────────────
async function getRecord(req, res) {
    try {
        let data = await Portfolio.find().sort({ _id: -1 })
        res.send({ result: "Done", count: data.length, data })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

// ─── GET ONE ─────────────────────────────────────────────────────────────────
async function getSingleRecord(req, res) {
    try {
        let data = await Portfolio.findOne({ _id: req.params._id })
        if (data)
            res.send({ result: "Done", data })
        else
            res.status(404).send({ result: "Fail", reason: "Record Not Found" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

// ─── UPDATE ──────────────────────────────────────────────────────────────────
async function updateRecord(req, res) {
    try {
        let data = await Portfolio.findOne({ _id: req.params._id })
        if (!data) return res.status(404).send({ result: "Fail", reason: "Record Not Found" })

        data.name             = req.body.name             ?? data.name
        data.shortDescription = req.body.shortDescription ?? data.shortDescription
        data.longDescription  = req.body.longDescription  ?? data.longDescription
        data.category         = req.body.category         ?? data.category
        data.tech             = req.body.tech             ?? data.tech
        data.liveUrl          = req.body.liveUrl          ?? data.liveUrl
        data.githubRepo       = req.body.githubRepo       ?? data.githubRepo
        data.active           = req.body.active           ?? data.active

        if (req.files && req.files.length > 0) {
            // ✅ Delete all OLD images, then set new ones
            await deleteAllFromCloudinary(data.pic);
            data.pic = req.files.map(f => f.path);
        } else if (req.body.keepPic) {
            // ✅ Support partial keeps: client can send keepPic[] = URLs to retain
            const keepPic = Array.isArray(req.body.keepPic)
                ? req.body.keepPic
                : [req.body.keepPic];

            // Delete only the ones NOT being kept
            const toDelete = (data.pic || []).filter(url => !keepPic.includes(url));
            await deleteAllFromCloudinary(toDelete);
            data.pic = keepPic;
        }

        await data.save()
        await syncResume("projects", data._id);

        res.send({ result: "Done", data })
    } catch (error) {
        if (req.files) await deleteAllFromCloudinary(req.files.map(f => f.path));
        res.status(400).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

// ─── DELETE ──────────────────────────────────────────────────────────────────
async function deleteRecord(req, res) {
    try {
        let data = await Portfolio.findOne({ _id: req.params._id })
        if (!data) return res.status(404).send({ result: "Fail", reason: "Record Not Found" })

        // ✅ Delete all images from Cloudinary
        await deleteAllFromCloudinary(data.pic);

        await data.deleteOne()
        res.send({ result: "Done", data })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }
}

module.exports = { createRecord, getRecord, getSingleRecord, updateRecord, deleteRecord }