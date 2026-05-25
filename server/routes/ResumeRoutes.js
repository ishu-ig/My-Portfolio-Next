const express = require("express");
const getResume = require("../controllers/ResumeContoller");
const ResumeRouter = express.Router();

ResumeRouter.get("", getResume);

module.exports = ResumeRouter;
