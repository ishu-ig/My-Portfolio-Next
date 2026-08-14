const NoteRouter = require("express").Router();
const { noteUploader } = require("../middleware/fileuploader");
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/NoteController");

NoteRouter.post("", noteUploader.single("file"), createRecord);
NoteRouter.get("", getRecord);
NoteRouter.get("/:_id", getSingleRecord);
NoteRouter.put("/:_id", noteUploader.single("file"), updateRecord);
NoteRouter.delete("/:_id", deleteRecord);

module.exports = NoteRouter;
