const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    memory: {
        type: Array,
        default: [],
    },
    title: {
      type: String,
      required: true,
    },
    totalPerticepents: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      default: true,
    },
    mission: {
      type: String,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Memories", memberSchema);