const CertificateRouter = require("express").Router()
const {certificateUploader } = require("../middleware/fileuploader")
const { verifyAdmin } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/CertificateController")

CertificateRouter.post("", verifyAdmin,certificateUploader.single("pic"), createRecord)
CertificateRouter.get("", getRecord)
CertificateRouter.get("/:_id", getSingleRecord)
CertificateRouter.put("/:_id",verifyAdmin,certificateUploader.single("pic"), updateRecord)
CertificateRouter.delete("/:_id",verifyAdmin, deleteRecord)


module.exports = CertificateRouter