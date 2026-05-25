const Education = require("../models/Education");
const syncResume = require("../resumeSync/resumeSync");

async function createRecord(req, res) {
    try {
        let data = new Education(req.body)
        await data.save()
        await syncResume("education", data._id);
        res.send({
            result: "Done",
            data: data,
        })
    } catch (error) {
        let errorMessage = {}
        error.errors?.degreeName ? errorMessage.degreeName = error.errors.degreeName.message : null
        error.errors?.instituteName ? errorMessage.instituteName = error.errors.instituteName.message : null
        error.errors?.startDate ? errorMessage.startDate = error.errors.startDate.message : null
        error.errors?.description ? errorMessage.description = error.errors.description.message : null

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
}

async function getRecord(req, res) {
    try {
        let data = await Education.find().sort({ _id: -1 })
        res.send({
            result: "Done",
            count: data.length,
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}


async function getSingleRecord(req, res) {
    try {
        let data = await Education.findOne({ _id: req.params._id })
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
        // console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function updateRecord(req, res) {
    try {
        let data = await Education.findOne({ _id: req.params._id })
        if (data) {
            data.degreeName = req.body.degreeName ?? data.degreeName
            data.instituteName = req.body.instituteName ?? data.instituteName
            data.startDate = req.body.startDate ?? data.startDate
            data.endDate = req.body.endDate ?? data.endDate
            data.description = req.body.description ?? data.description
            data.cgpa = req.body.cgpa ?? data.cgpa
            data.active = req.body.active ?? data.active
            await data.save()
            await syncResume("education", data._id);
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
        // console.log(error)

        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Education.findOne({ _id: req.params._id })
        if (data){
            try {
                fs.unlinkSync(data.pic)
            } catch (error) {}
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
        // console.log(error)
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