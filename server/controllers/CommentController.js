const Comment = require("../models/Comment");

// ==================================================
// CREATE Comment
// ==================================================
async function createRecord(req, res) {
    try {
        const data = new Comment(req.body);
        await data.save();

        const finalData = await Comment.findById(data._id).populate("blogId", ["title"]);

        res.send({
            result: "Done",
            data: finalData
        });

    } catch (error) {
        let errorMessage = {};

        if (error.errors?.name)
            errorMessage.name = error.errors.name.message;

        if (error.errors?.email)
            errorMessage.email = error.errors.email.message;

        if (error.errors?.commentText)
            errorMessage.commentText = error.errors.commentText.message;

        if (Object.keys(errorMessage).length > 0) {
            return res.status(400).send({
                result: "Fail",
                reason: errorMessage
            });
        }

        return res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        });
    }
}


// ==================================================
// GET ALL COMMENTS
// ==================================================
async function getRecord(req, res) {
    try {
        let data = await Comment.find().populate("blogId", ["title"]).sort({ _id: -1 });

        res.send({
            result: "Done",
            count: data.length,
            data: data
        });

    } catch (error) {
        return res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        });
    }
}


// ==================================================
// GET SINGLE COMMENT
// ==================================================
async function getSingleRecord(req, res) {
    try {
        let data = await Comment.findById(req.params._id).populate("blogId", ["title"]);

        if (!data) {
            return res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            });
        }

        res.send({
            result: "Done",
            data: data
        });

    } catch (error) {
        return res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        });
    }
}


// ==================================================
// UPDATE COMMENT
// ==================================================
async function updateRecord(req, res) {
    try {
        let data = await Comment.findById(req.params._id);

        if (!data) {
            return res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            });
        }

        // Update fields
        data.name = req.body.name ?? data.name;
        data.email = req.body.email ?? data.email;
        data.commentText = req.body.commentText ?? data.commentText;

        await data.save();

        res.send({
            result: "Done",
            data: data
        });

    } catch (error) {
        return res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        });
    }
}


// ==================================================
// DELETE COMMENT
// ==================================================
async function deleteRecord(req, res) {
    try {
        let data = await Comment.findById(req.params._id);

        if (!data) {
            return res.status(404).send({
                result: "Fail",
                reason: "Record Not Found"
            });
        }

        await data.deleteOne();

        res.send({
            result: "Done",
            data: data
        });

    } catch (error) {
        return res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        });
    }
}

module.exports = {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
};
