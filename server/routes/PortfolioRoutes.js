const PortfolioRouter = require("express").Router()
const { portfolioUploader } = require("../middleware/fileuploader")
const { verifyAdmin } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/PortfolioController")

PortfolioRouter.post("", verifyAdmin, portfolioUploader.single("pic"), createRecord)
PortfolioRouter.get("", getRecord)
PortfolioRouter.get("/:_id", getSingleRecord)
PortfolioRouter.put("/:_id",verifyAdmin, portfolioUploader.single("pic"), updateRecord)
PortfolioRouter.delete("/:_id",verifyAdmin, deleteRecord)


module.exports = PortfolioRouter