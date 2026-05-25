const BlogRouter = require("express").Router()
const { blogUploader } = require("../middleware/fileuploader")
const { verifyAdmin } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/BlogController")

BlogRouter.post("", verifyAdmin, blogUploader.single("pic"), createRecord)
BlogRouter.get("", getRecord)
BlogRouter.get("/:_id", getSingleRecord)
BlogRouter.put("/:_id",verifyAdmin, blogUploader.single("pic"), updateRecord)
BlogRouter.delete("/:_id",verifyAdmin, deleteRecord)


module.exports = BlogRouter