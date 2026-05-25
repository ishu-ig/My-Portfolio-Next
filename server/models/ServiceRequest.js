const mongoose = require("mongoose");

const ServiceRequestSchema = new mongoose.Schema(
  {
    servicename: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service is mandatory"],
    },
    name: {
      type: String,
      required: [true, "Name is mandatory"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email Address is mandatory"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone Number is mandatory"],
      trim: true,
      minlength: [10, "Phone number must be at least 10 digits"],
      maxlength: [15, "Phone number too long"],
    },
    message: {
      type: String,
      required: [true, "Message is mandatory"],
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const ServiceRequest = mongoose.model("ServiceRequest", ServiceRequestSchema);

module.exports = ServiceRequest;