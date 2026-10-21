const Team = require("../models/Team");

const getTeams = async (req, res) => {
  try {
    const teams = await Team.find().sort({
      name: 1,
    });

    res.status(200).json({
      success: true,
      count: teams.length,
      teams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getTeams,
};