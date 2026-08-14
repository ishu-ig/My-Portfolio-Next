const AboutRouter = require("express").Router();

const { verifyAdmin } = require("../middleware/authentication");

const { aboutUploader } = require("../middleware/fileuploader");

const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/AboutController");

AboutRouter.post(
    "",
    verifyAdmin,
    aboutUploader.fields([
        { name: "pic", maxCount: 1 },
        { name: "resume", maxCount: 1 }
    ]),
    createRecord
);

AboutRouter.get("", getRecord);

AboutRouter.get("/:_id", getSingleRecord);

AboutRouter.put(
    "/:_id",
    verifyAdmin,
    aboutUploader.fields([
        { name: "pic", maxCount: 1 },
        { name: "resume", maxCount: 1 }
    ]),
    updateRecord
);

AboutRouter.delete(
    "/:_id",
    verifyAdmin,
    deleteRecord
);

module.exports = AboutRouter;