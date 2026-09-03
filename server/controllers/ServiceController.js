const Service = require("../models/Service")
;
const syncResume = require("../resumeSync/resumeSync");

async function createRecord(req, res) {
    try {
        let data = new Service(req.body)
        await data.save()
        await syncResume("services", data._id);
        res.send({
            result: "Done",
            data: data
        })
    } catch (error) {

        let errorMessage = {}
        error.keyValue ? errorMessage.name = "Service With This Name Already Exist" : null
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.pic ? errorMessage.pic = error.errors.pic.message : null
        error.errors?.icon ? errorMessage.icon = error.errors.icon.message : null
        error.errors?.shortDescription ? errorMessage.shortDescription = error.errors.shortDescription.message : null
        error.errors?.longDescription ? errorMessage.longDescription = error.errors.longDescription.message : null
        error.errors?.price ? errorMessage.price = error.errors.price.message : null
        error.errors?.duration ? errorMessage.duration = error.errors.duration.message : null
        error.errors?.technology ? errorMessage.technology = error.errors.technology.message : null
        error.errors?.category ? errorMessage.category = error.errors.category.message : null

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
        let data = await Service.find().sort({ _id: -1 })
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


async function getSingleRecord(req, res) {
    try {
        let data = await Service.findOne({ _id: req.params._id })
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
        let data = await Service.findOne({ _id: req.params._id });
        if (data) {
            data.name = req.body.name ?? data.name;
            data.shortDescription = req.body.shortDescription ?? data.shortDescription;
            data.longDescription = req.body.longDescription ?? data.longDescription;
            data.price = req.body.price ?? data.price;
            data.duration = req.body.duration ?? data.duration;
            data.technology = req.body.technology ?? data.technology;
            data.category = req.body.category ?? data.category;
            data.icon = req.body.icon ?? data.icon;
            data.active = req.body.active ?? data.active;
            
            await data.save();
            await syncResume("services", data._id);
            
            res.send({ result: "Done", data: data });
        } else {
            res.status(404).send({ result: "Fail", reason: "Record Not Found" });
        }
    } catch (error) {
        let errorMessage = {};
        if (error.keyValue) errorMessage.name = "Service With This Name Already Exists";
        
        res.status(errorMessage ? 400 : 500).send({
            result: "Fail",
            reason: errorMessage || "Internal Server Error"
        });
    }
}


async function deleteRecord(req, res) {
    try {
        let data = await Service.findOne({ _id: req.params._id })
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
    updateRecord:updateRecord,
    deleteRecord:deleteRecord
}

async function sentRequest(req, res) {
    try {
        let data = new ContactUs(req.body)
        await data.save()
        mailer.sendMail({
            from: process.env.RESEND_FROM || process.env.MAIL_SENDER,
            to: data.email,
            subject: "Your Query Submission - " + (process.env.SITE_NAME || "Portfolio"),
            html: mailer.templates.getContactQueryReceivedTemplate({
                name: data.name,
                email: data.email,
                phone: data.phone,
                subject: data.subject,
                message: data.message
            }),
        }, (error) => {
            if (error) console.log("Service sentRequest Mail Error:", error);
        })

        res.send({
            result: "Done",
            data: data,
            message: "Thanks to Share Your Query With Us. Our Team Will Contact You Soon!!!"
        })
    } catch (error) {
        let errorMessage = {}
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.email ? errorMessage.email = error.errors.email.message : null
        error.errors?.phone ? errorMessage.phone = error.errors.phone.message : null
        error.errors?.subject ? errorMessage.subject = error.errors.subject.message : null
        error.errors?.message ? errorMessage.message = error.errors.message.message : null

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