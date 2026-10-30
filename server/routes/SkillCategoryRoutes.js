const SkillCategoryRouter = require("express").Router()
const { verifyAdmin } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/SkillCategoryController")

SkillCategoryRouter.post("", verifyAdmin, createRecord)
SkillCategoryRouter.get("", getRecord)
SkillCategoryRouter.get("/:_id", getSingleRecord)
SkillCategoryRouter.put("/:_id", verifyAdmin, updateRecord)
SkillCategoryRouter.delete("/:_id", verifyAdmin, deleteRecord)


module.exports = SkillCategoryRouter