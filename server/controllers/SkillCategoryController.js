const SkillCategory = require("../models/SkillCategory")

// Helper: build validation error message object
function getErrorMessage(error) {
    let errorMessage = {}
    error.errors?.name ? errorMessage.name = error.errors.name.message : null
    return errorMessage
}

// Helper: send error response
function sendError(res, errorMessage) {
    if (Object.values(errorMessage).length === 0) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
    else {
        res.status(400).send({
            result: "Fail",
            reason: errorMessage
        })
    }
}

async function createRecord(req, res) {
    try {
        let data = new SkillCategory(req.body)
        await data.save()
        res.send({
            result: "Done",
            data: data
        })
    } catch (error) {
        sendError(res, getErrorMessage(error))
    }
}

async function getRecord(req, res) {
    try {
        let data = await SkillCategory.find().sort({ _id: -1 })
        res.send({
            result: "Done",
            count: data.length,
            data: data
        })
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function getSingleRecord(req, res) {
    try {
        let data = await SkillCategory.findOne({ _id: req.params._id })
        if (data)
            res.send({
                result: "Done",
                data: data
            })
        else
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function updateRecord(req, res) {
    try {
        let data = await SkillCategory.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.active = req.body.active ?? data.active
            await data.save()
            res.send({
                result: "Done",
                data: data
            })
        }
        else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
        }
    } catch (error) {
        sendError(res, getErrorMessage(error))
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await SkillCategory.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne()
            res.send({
                result: "Done",
                data: data
            })
        }
        else
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

module.exports = {
    createRecord: createRecord,
    getRecord: getRecord,
    getSingleRecord: getSingleRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord
}