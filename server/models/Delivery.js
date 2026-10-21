const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },

    innings: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Innings",
      required: true,
    },

    over: {
      type: Number,
      required: true,
    },

    ball: {
      type: Number,
      required: true,
    },

    actualDelivery: {
      type: String,
    },

    batter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },

    bowler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },

    nonStriker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },

    battingTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },

    runs: {
      type: Number,
      default: 0,
    },

    batterRuns: {
      type: Number,
      default: 0,
    },

    extras: {
      type: Number,
      default: 0,
    },

    extrasType: {
      type: [String],
      default: [],
    },

    wicket: {
      type: Boolean,
      default: false,
    },

    wicketType: {
      type: String,
    },

    playerOut: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Delivery", deliverySchema);