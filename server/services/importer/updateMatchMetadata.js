const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");
const Match = require("../../models/Match");

require("dotenv").config();

// Cricsheet JSON files
const DATA_FOLDER = path.join(__dirname, "../../../data/sa20");

const updateMatchMetadata = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Get all Cricsheet JSON files
    const files = fs
      .readdirSync(DATA_FOLDER)
      .filter((file) => file.endsWith(".json"));

    console.log(`Found ${files.length} JSON files`);

    // Create a map:
    // 1343941 -> /path/to/1343941.json
    const jsonFiles = new Map();

    for (const file of files) {
      const matchId = path.basename(file, ".json");
      jsonFiles.set(matchId, file);
    }

    // Get existing matches from MongoDB
    const matches = await Match.find({});

    console.log(`Found ${matches.length} matches in MongoDB`);

    let updated = 0;
    let notFound = 0;

    for (const match of matches) {
      // Existing DB value is something like:
      // ../data/sa20/1343941.json

      const matchId = path.basename(
        match.externalMatchId,
        ".json"
      );

      const jsonFile = jsonFiles.get(matchId);

      if (!jsonFile) {
        notFound++;

        console.log(
          `Cricsheet file not found for DB match: ${match.externalMatchId}`
        );

        continue;
      }

      // Read corresponding Cricsheet JSON
      const filePath = path.join(DATA_FOLDER, jsonFile);

      const rawData = fs.readFileSync(filePath, "utf-8");

      const data = JSON.parse(rawData);

      // Get metadata from Cricsheet
      const competition =
        data.info.event?.name || "Unknown";

      const season =
        data.info.season != null
          ? String(data.info.season)
          : "Unknown";

      // Update ONLY competition and season
      await Match.updateOne(
        {
          _id: match._id,
        },
        {
          $set: {
            competition,
            season,
          },
        }
      );

      updated++;

      console.log(
        `Updated ${matchId} → ${competition} ${season}`
      );
    }

    console.log("\n========== DONE ==========");
    console.log(`JSON files: ${files.length}`);
    console.log(`MongoDB matches: ${matches.length}`);
    console.log(`Updated: ${updated}`);
    console.log(`Not found: ${notFound}`);

    await mongoose.disconnect();

    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Migration error:", error);

    await mongoose.disconnect();

    process.exit(1);
  }
};

updateMatchMetadata();