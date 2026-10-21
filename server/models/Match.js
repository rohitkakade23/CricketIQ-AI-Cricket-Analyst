const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    externalMatchId: {
      type: String,
      unique: true,
      sparse: true,
    },

    competition: {
    type: String,
    required: true,
    },

    season: {
      type: String,
      required: true,
    },

    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],

    format: {
      type: String,
      enum: ["Test", "ODI", "T20", "T20I", "Other"],
    },

    date: {
      type: Date,
    },

    venue: {
      type: String,
    },

    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },

    result: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Match", matchSchema);