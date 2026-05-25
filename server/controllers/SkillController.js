const Skill = require("../models/Skill")
;
const syncResume = require("../resumeSync/resumeSync");


async function createRecord(req, res) {
    try {
        let data = new Skill(req.body)
        await data.save()
        await syncResume("skills", data._id);
        res.send({
            result: "Done",
            data: data
        })
    } catch (error) {


        let errorMessage = {}
        error.keyValue ? errorMessage.name = "Skill With This Name Already Exist" : null
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.description ? errorMessage.description = error.errors.description.message : null
        error.errors?.level ? errorMessage.level = error.errors.level.message : null

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
        let data = await Skill.find().sort({ _id: -1 })
        res.send({
            result: "Done",
            count: data.length,
            data: data
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
        let data = await Skill.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.description = req.body.description ?? data.description
            data.level = req.body.level ?? data.level
            data.active = req.body.active ?? data.active
            await data.save()
            await syncResume("skills", data._id);
            
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
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }

        let errorMessage = {}
        error.keyValue ? errorMessage.name = "Skill With This Name Already Exist" : null

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

async function deleteRecord(req, res) {
    try {
        let data = await Skill.findOne({ _id: req.params._id })
        if (data){
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
    updateRecord:updateRecord,
    deleteRecord:deleteRecord
}