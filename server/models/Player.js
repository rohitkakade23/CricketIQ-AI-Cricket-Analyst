const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: [
        "Batsman",
        "Bowler",
        "All-Rounder",
        "Wicket-Keeper",
      ],
    },

    battingHand: {
      type: String,
      enum: ["right", "left"],
},

    battingStyle: {
      type: String,
    },

    bowlingStyle: {
      type: String,
    },

    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Player", playerSchema);