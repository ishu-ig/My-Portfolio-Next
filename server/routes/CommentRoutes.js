const CommentRouter = require("express").Router()
const { verifyAdmin } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/CommentController")

CommentRouter.post("",createRecord)
CommentRouter.get("", getRecord)
CommentRouter.get("/:_id", getSingleRecord)
CommentRouter.put("/:_id",verifyAdmin, updateRecord)
CommentRouter.delete("/:_id",verifyAdmin, deleteRecord)


module.exports = CommentRouter