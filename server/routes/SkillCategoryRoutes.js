const SkillCategoryRouter = require("express").Router()
const {skillCategoryUploader } = require("../middleware/fileuploader")
const { verifyAdmin } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/SkillCategoryController")

SkillCategoryRouter.post("", verifyAdmin,skillCategoryUploader.single("pic"), createRecord)
SkillCategoryRouter.get("", getRecord)
SkillCategoryRouter.get("/:_id", getSingleRecord)
SkillCategoryRouter.put("/:_id",verifyAdmin,skillCategoryUploader.single("pic"), updateRecord)
SkillCategoryRouter.delete("/:_id",verifyAdmin, deleteRecord)


module.exports = CertificateRouter