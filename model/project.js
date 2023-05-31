const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        default: null,
    },
    detail: {
        type: String,
        default: null,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Projects", projectSchema);