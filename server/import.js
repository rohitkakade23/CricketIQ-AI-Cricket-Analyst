require("dotenv").config();

const fs = require("fs");
const path = require("path");

const connectDB = require("./config/db");
const importMatch = require("./services/importer/importMatch");

const runImport = async () => {
  try {
    await connectDB();

    const dataDirectory = path.join(
      __dirname,
      "../data/sa20"
    );

    const files = fs
      .readdirSync(dataDirectory)
      .filter((file) => file.endsWith(".json"));

    console.log(`Found ${files.length} match files.`);

    for (const file of files) {
      console.log("\n-----------------------------");
      console.log(`Importing: ${file}`);
      console.log("-----------------------------");

      try {
        await importMatch(
          path.join(dataDirectory, file)
        );
      } catch (error) {
        console.error(
          `Failed to import ${file}:`,
          error.message
        );
      }
    }

    console.log("\n🎉 Bulk import completed!");

    process.exit(0);
  } catch (error) {
    console.error("Import failed:", error);
    process.exit(1);
  }
};

runImport();