const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      required: [true, "Icon class is required"],
      trim: true,
      // Bootstrap icon class e.g. "bi bi-briefcase"
    },
    label: {
      type: String,
      required: [true, "Label is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["counter", "static"],
      default: "counter",
      // counter → animated number; static → badge text
    },
    // Used when type === "counter"
    target: {
      type: Number,
      default: null,
    },
    // Used when type === "static"
    stat: {
      type: String,
      default: null,
      trim: true,
    },
    // Display order
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Achievement", AchievementSchema);