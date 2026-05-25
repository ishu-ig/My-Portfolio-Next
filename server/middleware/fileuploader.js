const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary");

function createUploader(folder) {
    const storage = new CloudinaryStorage({
        cloudinary,
        params: async (req, file) => {
            const cleanName = file.originalname
                .replace(/\s+/g, "_")
                .replace(/[()]/g, "")
                .replace(/[^a-zA-Z0-9._-]/g, "");

            const isPdf = file.mimetype === "application/pdf";

            return {
                folder: `portfolio/${folder}`,
                allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
                resource_type: isPdf ? "raw" : "image",
                public_id: `${Date.now()}_${cleanName.split(".")[0]}`,
            };
        },
    });

    return multer({
        storage,
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB
        },
    });
}

module.exports = {
    portfolioUploader: createUploader("portfolio"),
    certificateUploader: createUploader("certificate"),
    testimonialUploader: createUploader("testimonial"),
    userUploader: createUploader("user"),
    blogUploader: createUploader("blog"),
};