const mongoose = require("mongoose");

const inningsSchema = new mongoose.Schema(
  {
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    inningsNumber: {
      type: Number,
      required: true,
    },

    runs: {
      type: Number,
      default: 0,
    },

    wickets: {
      type: Number,
      default: 0,
    },

    overs: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Innings", inningsSchema);