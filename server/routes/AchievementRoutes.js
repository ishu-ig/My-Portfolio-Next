const RecordRouter  = require("express").Router()
const {
  getRecord,
  getSingleRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  toggleRecord,
} = require("../controllers/AchievementController")

// Public
RecordRouter.get("/",          getRecord);
RecordRouter.get("/:id",       getSingleRecord);

// Admin (add your auth middleware here if needed)
RecordRouter.post("/",         createRecord);
RecordRouter.put("/:id",       updateRecord);
RecordRouter.delete("/:id",    deleteRecord);

module.exports = RecordRouter;