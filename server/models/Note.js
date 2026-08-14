const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Note Title is Mandatory"],
            trim: true,
        },
        subject: {
            type: String,
            default: "General",
            trim: true,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        file: {
            type: String,
            required: [true, "PDF File is Mandatory"],
        },
        fileName: {
            type: String,
            default: "document.pdf",
        },
        fileSize: {
            type: String,
            default: "",
        },
        tags: {
            type: String,
            default: "",
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Note", NoteSchema);
