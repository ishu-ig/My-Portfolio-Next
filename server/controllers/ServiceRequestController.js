const ServiceRequest = require("../models/ServiceRequest")
const mailer = require("../mailer/index")

// Fields to populate from the Service model
const SERVICE_POPULATE = "name icon shortDescription price duration category technology"

async function createRecord(req, res) {
    try {
        let data = new ServiceRequest(req.body)
        await data.save()
        
        // Populate service details for the email
        await data.populate("servicename", SERVICE_POPULATE)

        mailer.sendMail({
            from: process.env.RESEND_FROM || process.env.MAIL_SENDER,
            to: data.email,
            subject: `Service Request Confirmation - ${process.env.SITE_NAME || "Portfolio"}`,
            html: mailer.templates.getServiceRequestReceivedTemplate({
                name: data.name,
                email: data.email,
                phone: data.phone,
                service: data.servicename,
                message: data.message
            }),
        }, (error) => {
            if (error) console.log("ServiceRequest Mail Error:", error)
        })

        res.status(201).send({
            result: "Done",
            data: data,
            message: "Thanks for sharing your query with us. Our team will contact you soon!"
        })
    } catch (error) {
        let errorMessage = {}

        error.errors?.servicename ? errorMessage.servicename = error.errors.servicename.message : null
        error.errors?.name        ? errorMessage.name        = error.errors.name.message        : null
        error.errors?.email       ? errorMessage.email       = error.errors.email.message       : null
        error.errors?.phone       ? errorMessage.phone       = error.errors.phone.message       : null
        error.errors?.message     ? errorMessage.message     = error.errors.message.message     : null

        if (Object.values(errorMessage).length === 0) {
            console.log(error)
            res.status(500).send({
                result: "Fail",
                reason: "Internal Server Error"
            })
        } else {
            res.status(400).send({
                result: "Fail",
                reason: errorMessage
            })
        }
    }
}

async function getRecord(req, res) {
    try {
        let data = await ServiceRequest.find()
            .populate("servicename", SERVICE_POPULATE)
            .sort({ _id: -1 })
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
        let data = await ServiceRequest.findById(req.params._id)
            .populate("servicename", SERVICE_POPULATE)
        if (data) {
            res.send({
                result: "Done",
                data: data
            })
        } else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function updateRecord(req, res) {
    try {
        let data = await ServiceRequest.findById(req.params._id)
        if (data) {
            data.active = req.body.active ?? data.active
            await data.save()
            await data.populate("servicename", SERVICE_POPULATE)

            if (data.active === false) {
                mailer.sendMail({
                    from: process.env.RESEND_FROM || process.env.MAIL_SENDER,
                    to: data.email,
                    subject: `Service Request Resolved - Team ${process.env.SITE_NAME || "Portfolio"}`,
                    html: mailer.templates.getServiceRequestResolvedTemplate({
                        name: data.name,
                        serviceName: data.servicename?.name
                    }),
                }, (error) => {
                    if (error) console.log("ServiceRequest Mail Error:", error)
                })
            }

            res.send({
                result: "Done",
                data: data
            })
        } else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await ServiceRequest.findById(req.params._id)
        if (data && data.active === false) {
            await data.deleteOne()
            res.send({
                result: "Done",
                data: data
            })
        } else if (data?.active) {
            res.status(400).send({
                result: "Fail",
                reason: "Unable to delete record. Query has not been resolved yet."
            })
        } else {
            res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

module.exports = {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
}