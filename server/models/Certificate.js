const mongoose = require("mongoose")

const CertificateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Certificate Name is Mendatory"]
    },
    pic: {
        type: String,
        required: [true, "Description is Mendatory"]
    },
    issuedBy: {
        type: String,
        required: [true, "Issue Name Is Mendatory is Mendatory"]
    },
    active: {
        type: Boolean,
        default: true
    },
})
const Certificate = new mongoose.model("Certificate", CertificateSchema)

module.exports = Certificate