const Achievement = require("../models/Achievement")

const getRecord = async (req, res) => {
  try {
    const records = await Achievement.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getSingleRecord = async (req, res) => {
  try {
    const record = await Achievement.findById(req.params.id);
    if (!record)
      return res.status(404).json({ message: "Record not found" });
    res.status(200).json(record);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const createRecord = async (req, res) => {
  try {
    const { icon, label, type, target, stat, order, active } = req.body;

    if (!icon || !label)
      return res.status(400).json({ message: "icon and label are required" });

    if (type === "counter" && (target === undefined || target === null))
      return res.status(400).json({ message: "target is required for counter type" });

    if (type === "static" && !stat)
      return res.status(400).json({ message: "stat is required for static type" });

    const record = await Achievement.create({
      icon,
      label,
      type:   type   ?? "counter",
      target: target ?? null,
      stat:   stat   ?? null,
      order:  order  ?? 0,
      active: active ?? true,
    });

    res.status(201).json(record);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateRecord = async (req, res) => {
  try {
    const { icon, label, type, target, stat, order, active } = req.body;

    const record = await Achievement.findById(req.params.id);
    if (!record)
      return res.status(404).json({ message: "Record not found" });

    if (icon   !== undefined) record.icon   = icon;
    if (label  !== undefined) record.label  = label;
    if (type   !== undefined) record.type   = type;
    if (target !== undefined) record.target = target;
    if (stat   !== undefined) record.stat   = stat;
    if (order  !== undefined) record.order  = order;
    if (active !== undefined) record.active = active;

    const updated = await record.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const record = await Achievement.findByIdAndDelete(req.params.id);
    if (!record)
      return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getRecord,
  getSingleRecord,
  createRecord,
  updateRecord,
  deleteRecord,
};