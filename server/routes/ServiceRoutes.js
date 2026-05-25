const ServiceRouter = require("express").Router()
const {verifyAdmin } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/ServiceController")

ServiceRouter.post("", verifyAdmin, createRecord)
ServiceRouter.get("", getRecord)
ServiceRouter.get("/:_id", getSingleRecord)
ServiceRouter.put("/:_id", verifyAdmin, updateRecord)
ServiceRouter.delete("/:_id",verifyAdmin ,deleteRecord)


module.exports = ServiceRouter