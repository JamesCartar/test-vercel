const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    salt: {
      type: String,
      default: null,
    },
    age: {
      type: Number,
      default: null,
    },
    department: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    address: {
        type: String,
        default: null,
    },
    job: {
        type: String,
        default: null,
    },
    status: {
      type: String,
      enum: ["active", "leave"],
      default: 'active'
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Members", memberSchema);