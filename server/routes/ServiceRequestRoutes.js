const ServiceRequestRouter = require("express").Router()
const {verifyAdmin, } = require("../middleware/authentication")
const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord,
} = require("../controllers/ServiceRequestController")

ServiceRequestRouter.post("", createRecord)
ServiceRequestRouter.get("",  getRecord)
ServiceRequestRouter.get("/:_id",verifyAdmin,  getSingleRecord)
ServiceRequestRouter.put("/:_id",verifyAdmin,  updateRecord)
ServiceRequestRouter.delete("/:_id",verifyAdmin,  deleteRecord)


module.exports = ServiceRequestRouter