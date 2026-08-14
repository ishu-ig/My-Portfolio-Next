const User = require("../models/User")
const cloudinary = require("../cloudinary");

const mailer = require("../mailer/index")
const passwordValidator = require('password-validator')
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")

const schema = new passwordValidator();

// Add properties to it
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase(1)                             // Must have at least 1 uppercase letter
    .has().lowercase(1)                             // Must have at least 1 lowercase letter
    .has().digits(1)                                // Must have at least 1 digit
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

// Helper: extract Cloudinary public_id from URL
function getPublicId(url) {
    if (!url) return null;
    // e.g. https://res.cloudinary.com/cloud/image/upload/v123/portfolio/blog/abc.jpg
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    // Skip version segment (v123)
    const pathParts = parts.slice(uploadIndex + 2);
    return pathParts.join("/").replace(/\.[^/.]+$/, ""); // remove extension
}

// Helper: delete from Cloudinary
async function deleteFromCloudinary(url) {
    const publicId = getPublicId(url);
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (e) { }
}


async function createRecord(req, res) {
    async function createRecord(req, res) {
        if (schema.validate(req.body.password)) {
            bcrypt.hash(req.body.password, 12, async (error, hash) => {
                if (error) {
                    return res.status(500).send({
                        result: "Fail",
                        reason: "Internal Server Error"
                    });
                }

                try {
                    let data = new User(req.body);

                    data.password = hash;

                    if (req.files?.pic) {
                        data.pic = req.files.pic[0].path;
                    }

                    if (req.files?.resume) {
                        data.resume = req.files.resume[0].path;
                    }

                    await data.save();

                    res.send({
                        result: "Done",
                        data
                    });

                } catch (error) {

                    if (req.files?.pic) {
                        await deleteFromCloudinary(req.files.pic[0].path);
                    }

                    if (req.files?.resume) {
                        await deleteFromCloudinary(req.files.resume[0].path);
                    }

                    let errorMessage = {};

                    if (error.keyValue?.username)
                        errorMessage.username = "User Name Already Exist";

                    if (error.keyValue?.email)
                        errorMessage.email = "Email Already Exist";

                    if (error.errors?.name)
                        errorMessage.name = error.errors.name.message;

                    if (error.errors?.username)
                        errorMessage.username = error.errors.username.message;

                    if (error.errors?.email)
                        errorMessage.email = error.errors.email.message;

                    if (error.errors?.phone)
                        errorMessage.phone = error.errors.phone.message;

                    if (error.errors?.password)
                        errorMessage.password = error.errors.password.message;

                    res.status(400).send({
                        result: "Fail",
                        reason: errorMessage
                    });
                }
            });
        }
        else {
            res.status(400).send({
                result: "Fail",
                reason: "Invalid Password"
            });
        }
    }
}

async function getRecord(req, res) {
    try {
        let data = await User.find().sort({ _id: -1 })
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
        let data = await User.findOne({ _id: req.params._id })
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
        let data = await User.findById(req.params._id);

        if (!data) {
            return res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            });
        }

        data.name = req.body.name ?? data.name;
        data.username = req.body.username ?? data.username;
        data.email = req.body.email ?? data.email;
        data.phone = req.body.phone ?? data.phone;
        data.address = req.body.address ?? data.address;
        data.pin = req.body.pin ?? data.pin;
        data.city = req.body.city ?? data.city;
        data.state = req.body.state ?? data.state;
        data.active = req.body.active ?? data.active;

        // Profile Image
        if (req.files?.pic) {

            if (data.pic) {
                await deleteFromCloudinary(data.pic);
            }

            data.pic = req.files.pic[0].path;
        }

        // Resume PDF
        if (req.files?.resume) {

            if (data.resume) {
                await deleteFromCloudinary(data.resume);
            }

            data.resume = req.files.resume[0].path;
        }

        await data.save();

        res.send({
            result: "Done",
            data
        });

    } catch (error) {

        if (req.files?.pic) {
            await deleteFromCloudinary(req.files.pic[0].path);
        }

        if (req.files?.resume) {
            await deleteFromCloudinary(req.files.resume[0].path);
        }

        let errorMessage = {};

        if (error.keyValue?.username)
            errorMessage.username = "User Name Already Exist";

        if (error.keyValue?.email)
            errorMessage.email = "Email Already Exist";

        res.status(400).send({
            result: "Fail",
            reason: Object.keys(errorMessage).length
                ? errorMessage
                : "Internal Server Error"
        });
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
            // Delete image from Cloudinary
            await deleteFromCloudinary(data.pic);
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

async function login(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            if (await bcrypt.compare(req.body.password, data.password)) {
                let key = data.role === "Buyer" ? process.env.JWT_SECRET_KEY_BUYER : process.env.JWT_SECRET_KEY_ADMIN
                jwt.sign({ data }, key, { expiresIn: "15 Days" }, (error, token) => {
                    if (error)
                        res.status(500).send({
                            result: "Fail",
                            reason: "Internal Server Error"
                        })
                    else
                        res.send({
                            result: "Done",
                            data: data,
                            token: token
                        })
                })
            }
            else
                res.status(401).send({
                    result: "Fail",
                    reason: "Invalid Username or Password"
                })
        }
        else {
            res.status(401).send({
                result: "Fail",
                reason: "Invalid Username or Password"
            })
        }
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPassword1(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { "username": req.body.username },
                { "email": req.body.username }
            ]
        })
        if (data) {
            let otp = Number(Number(Math.random().toString().slice(2, 8)).toString().padEnd(6, 1))
            data.otp = otp
            await data.save()

            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: data.email,
                subject: `OTP for Password Reset : Team ${process.env.SITE_NAME}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                        <h2 style="text-align: center; color: #333;">Password Reset Request</h2>
                        <p>Hello <strong>${data.name}</strong>,</p>
                        <p>You have requested a password reset.</p>
                        <div style="text-align: center; font-size: 18px; font-weight: bold; padding: 10px; background-color: #f3f3f3; border-radius: 5px;">
                            Your OTP: <span style="color: #d32f2f; font-size: 22px;">${data.otp}</span>
                        </div>
                        <p style="color: #d32f2f; text-align: center; font-size: 14px;">Please do not share this OTP with anyone.</p>
                        <p>This OTP is valid for a limited time.</p>
                        <p>Regards,</p>
                        <p><strong>Team ${process.env.SITE_NAME}</strong></p>
                    </div>
                `
            }, (error) => {
                if (error)
                    console.log(error)
            })
            res.send({
                result: "Done",
                message: "OTP Has Been Sent On Your Registered Email Address"
            })
        }
        else {
            res.status(404).send({
                result: "Fail",
                reason: "User Not Found"
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

async function forgetPassword2(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { "username": req.body.username },
                { "email": req.body.username }
            ]
        })
        if (data) {
            if (data.otp == req.body.otp)
                res.send({
                    result: "Done"
                })
            else
                res.status(400).send({
                    result: "Fail",
                    reason: "Invalid OTP"
                })
        }
        else {
            res.status(401).send({
                result: "Fail",
                reason: "UnAuthorized Activity"
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

async function forgetPassword3(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { "username": req.body.username },
                { "email": req.body.username }
            ]
        })
        if (data) {
            if (schema.validate(req.body.password)) {
                bcrypt.hash(req.body.password, 12, async (error, hash) => {
                    if (error) {
                        console.log(error)
                        res.status(500).send({
                            result: "Fail",
                            reason: "Internal Server Error"
                        })
                    }
                    else {
                        data.password = hash
                        await data.save()
                        res.send({
                            result: "Done",
                            reason: "Password Has Been Reset"
                        })
                    }
                })
            }
            else
                res.status(400).send({
                    result: "Fail",
                    reason: "Invalid Password. It Must Container at least 1 upper case and 1 lower case alphabet, 1 digit, should not contain any space and length must be 8-100"
                })
        }
        else {
            res.status(401).send({
                result: "Fail",
                reason: "UnAuthorized Activity"
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
    createRecord: createRecord,
    getRecord: getRecord,
    getSingleRecord: getSingleRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord,
    login: login,
    forgetPassword1: forgetPassword1,
    forgetPassword2: forgetPassword2,
    forgetPassword3: forgetPassword3
}