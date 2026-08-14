const Note = require("../models/Note");
const cloudinary = require("../cloudinary");

// Helper: extract Cloudinary public_id from URL
function getPublicId(url) {
    if (!url) return null;
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    const pathParts = parts.slice(uploadIndex + 2);
    return pathParts.join("/").replace(/\.[^/.]+$/, "");
}

// Helper: delete from Cloudinary
async function deleteFromCloudinary(url) {
    const publicId = getPublicId(url);
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
        await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    } catch (e) { }
}

function formatBytes(bytes) {
    if (!bytes || bytes === 0) return "0 KB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

async function createRecord(req, res) {
    try {
        const { title, subject, description, tags, isPinned, active } = req.body;

        if (!req.file) {
            return res.status(400).send({
                result: "Fail",
                reason: { file: "PDF file is required" },
            });
        }

        const data = new Note({
            title,
            subject: subject || "General",
            description: description || "",
            file: req.file.path,
            fileName: req.file.originalname || "document.pdf",
            fileSize: formatBytes(req.file.size),
            tags: tags || "",
            isPinned: isPinned === "true" || isPinned === true,
            active: active === "false" || active === false ? false : true,
        });

        await data.save();
        res.send({
            result: "Done",
            data: data,
        });
    } catch (error) {
        if (req.file) await deleteFromCloudinary(req.file.path);

        const errorMessage = {};
        if (error.errors?.title) errorMessage.title = error.errors.title.message;
        if (error.errors?.file) errorMessage.file = error.errors.file.message;

        if (Object.values(errorMessage).length === 0) {
            res.status(500).send({
                result: "Fail",
                reason: "Internal Server Error",
            });
        } else {
            res.status(400).send({
                result: "Fail",
                reason: errorMessage,
            });
        }
    }
}

async function getRecord(req, res) {
    try {
        const data = await Note.find().sort({ isPinned: -1, createdAt: -1 });
        res.send({
            result: "Done",
            count: data.length,
            data: data,
        });
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error",
        });
    }
}

async function getSingleRecord(req, res) {
    try {
        const data = await Note.findOne({ _id: req.params._id });
        if (data) {
            res.send({
                result: "Done",
                data: data,
            });
        } else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found",
            });
        }
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error",
        });
    }
}

async function updateRecord(req, res) {
    try {
        const data = await Note.findOne({ _id: req.params._id });
        if (data) {
            data.title = req.body.title ?? data.title;
            data.subject = req.body.subject ?? data.subject;
            data.description = req.body.description ?? data.description;
            data.tags = req.body.tags ?? data.tags;
            if (req.body.isPinned !== undefined) {
                data.isPinned = req.body.isPinned === "true" || req.body.isPinned === true;
            }
            if (req.body.active !== undefined) {
                data.active = req.body.active === "true" || req.body.active === true;
            }

            if (req.file) {
                await deleteFromCloudinary(data.file);
                data.file = req.file.path;
                data.fileName = req.file.originalname || data.fileName;
                data.fileSize = formatBytes(req.file.size);
            }

            await data.save();
            res.send({
                result: "Done",
                data: data,
            });
        } else {
            if (req.file) await deleteFromCloudinary(req.file.path);
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found",
            });
        }
    } catch (error) {
        if (req.file) await deleteFromCloudinary(req.file.path);
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error",
        });
    }
}

async function deleteRecord(req, res) {
    try {
        const data = await Note.findOne({ _id: req.params._id });
        if (data) {
            await deleteFromCloudinary(data.file);
            await data.deleteOne();
            res.send({
                result: "Done",
                data: data,
            });
        } else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found",
            });
        }
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error",
        });
    }
}

module.exports = {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
};
