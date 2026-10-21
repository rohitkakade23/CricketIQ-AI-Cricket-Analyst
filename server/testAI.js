require("dotenv").config();

const {
  generateAIResponse
} = require("./services/ai/aiService");

const {
  buildMatchPrompt
} = require("./services/ai/matchPrompt");


const testMatchAI = async () => {
  try {

    const match = {
      teams: [
        "Sunrisers Eastern Cape",
        "Durban's Super Giants"
      ],
      venue: "St George's Park",
      result: "Sunrisers Eastern Cape won by 5 wickets"
    };

    const battingScorecards = [
      {
        player: "Player 1",
        runs: 75,
        balls: 48,
        fours: 7,
        sixes: 3,
        strikeRate: 156.25
      },
      {
        player: "Player 2",
        runs: 42,
        balls: 35,
        fours: 4,
        sixes: 1,
        strikeRate: 120
      }
    ];

    const bowlingScorecards = [
      {
        player: "Bowler 1",
        overs: 4,
        runs: 24,
        wickets: 3,
        economy: 6
      },
      {
        player: "Bowler 2",
        overs: 4,
        runs: 38,
        wickets: 1,
        economy: 9.5
      }
    ];

    const keyPerformers = [
      {
        player: "Player 1",
        contribution: "75 runs from 48 balls"
      },
      {
        player: "Bowler 1",
        contribution: "3 wickets for 24 runs"
      }
    ];


    const prompt = buildMatchPrompt({
      match,
      battingScorecards,
      bowlingScorecards,
      keyPerformers
    });


    console.log("\n========== MATCH PROMPT ==========\n");
    console.log(prompt);


    const response = await generateAIResponse(prompt);


    console.log("\n========== GEMINI RESPONSE ==========\n");
    console.log(response);


    console.log("\n=====================================\n");

  } catch (error) {

    console.error("\nMatch AI Error:");
    console.error(error);

  }
};


testMatchAI();