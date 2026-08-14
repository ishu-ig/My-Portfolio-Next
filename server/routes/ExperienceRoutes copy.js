const ExperienceRouter = require("express").Router()
const { verifyAdmin } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/ExperienceController")

ExperienceRouter.post("", verifyAdmin, createRecord)
ExperienceRouter.get("", getRecord)
ExperienceRouter.put("/:_id",verifyAdmin,  updateRecord)
ExperienceRouter.delete("/:_id",verifyAdmin,  deleteRecord)


module.exports = ExperienceRouter