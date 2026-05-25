const SkillRouter = require("express").Router()
const { verifyAdmin } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/SkillController")

SkillRouter.post("", verifyAdmin, createRecord)
SkillRouter.get("", getRecord)
SkillRouter.put("/:_id", verifyAdmin, updateRecord)
SkillRouter.delete("/:_id", verifyAdmin, deleteRecord)


module.exports = SkillRouter