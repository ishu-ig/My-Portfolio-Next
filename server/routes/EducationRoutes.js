const EducationRouter = require("express").Router()
const { verifyAdmin } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/EducationController")

EducationRouter.post("", verifyAdmin, createRecord)
EducationRouter.get("", getRecord)
EducationRouter.put("/:_id",verifyAdmin,  updateRecord)
EducationRouter.delete("/:_id",verifyAdmin,  deleteRecord)


module.exports = EducationRouter