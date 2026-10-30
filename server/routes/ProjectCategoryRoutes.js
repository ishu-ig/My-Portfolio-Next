const ProjectCategoryRouter = require("express").Router()
const { verifyAdmin } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/ProjectCategoryController")

ProjectCategoryRouter.post("", verifyAdmin, createRecord)
ProjectCategoryRouter.get("", getRecord)
ProjectCategoryRouter.get("/:_id", getSingleRecord)
ProjectCategoryRouter.put("/:_id", verifyAdmin, updateRecord)
ProjectCategoryRouter.delete("/:_id", verifyAdmin, deleteRecord)


module.exports = ProjectCategoryRouter