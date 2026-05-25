const Blog = require("../models/Blog");
const cloudinary = require("../cloudinary");

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
    } catch (e) {}
}

// ==================================================
// CREATE BLOG
// ==================================================
async function createRecord(req, res) {
    try {
        let data = new Blog(req.body);

        if (req.file) {
            data.pic = req.file.path; // Cloudinary URL
        }

        await data.save();

        res.send({ result: "Done", data });

    } catch (error) {
        // Delete uploaded Cloudinary file if validation fails
        if (req.file) await deleteFromCloudinary(req.file.path);

        let errorMessage = {};
        error.errors?.title           && (errorMessage.title            = error.errors.title.message);
        error.errors?.pic             && (errorMessage.pic              = error.errors.pic.message);
        error.errors?.shortDescription && (errorMessage.shortDescription = error.errors.shortDescription.message);
        error.errors?.longDescription  && (errorMessage.longDescription  = error.errors.longDescription.message);
        error.errors?.category        && (errorMessage.category         = error.errors.category.message);
        error.errors?.author          && (errorMessage.author           = error.errors.author.message);

        if (Object.keys(errorMessage).length === 0) {
            return res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
        } else {
            return res.status(400).send({ result: "Fail", reason: errorMessage });
        }
    }
}

// ==================================================
// GET ALL BLOGS
// ==================================================
async function getRecord(req, res) {
    try {
        let data = await Blog.find().sort({ _id: -1 });
        res.send({ result: "Done", count: data.length, data });
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

// ==================================================
// GET SINGLE BLOG
// ==================================================
async function getSingleRecord(req, res) {
    try {
        let data = await Blog.findOne({ _id: req.params._id });

        if (data) {
            res.send({ result: "Done", data });
        } else {
            res.status(404).send({ result: "Fail", reason: "Record Not Found" });
        }
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

// ==================================================
// UPDATE BLOG
// ==================================================
async function updateRecord(req, res) {
    try {
        let data = await Blog.findOne({ _id: req.params._id });

        if (!data) {
            return res.status(404).send({ result: "Fail", reason: "Record Not Found" });
        }

        data.title            = req.body.title            ?? data.title;
        data.shortDescription = req.body.shortDescription ?? data.shortDescription;
        data.longDescription  = req.body.longDescription  ?? data.longDescription;
        data.category         = req.body.category         ?? data.category;
        data.tags             = req.body.tags             ?? data.tags;
        data.author           = req.body.author           ?? data.author;
        data.active           = req.body.active           ?? data.active;

        if (req.file) {
            // Delete old image from Cloudinary before replacing
            await deleteFromCloudinary(data.pic);
            data.pic = req.file.path; // new Cloudinary URL
        }

        await data.save();

        res.send({ result: "Done", data });

    } catch (error) {
        // Delete newly uploaded file if update failed
        if (req.file) await deleteFromCloudinary(req.file.path);

        res.status(400).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

// ==================================================
// DELETE BLOG
// ==================================================
async function deleteRecord(req, res) {
    try {
        let data = await Blog.findOne({ _id: req.params._id });

        if (!data) {
            return res.status(404).send({ result: "Fail", reason: "Record Not Found" });
        }

        // Delete image from Cloudinary
        await deleteFromCloudinary(data.pic);

        await data.deleteOne();

        res.send({ result: "Done", data });

    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

module.exports = {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
};