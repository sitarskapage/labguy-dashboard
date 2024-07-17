// Importing fs-extra correctly for ES Modules or TypeScript
import fse from "fs-extra";
import { existsSync, writeFileSync } from "fs";
import { createInterface } from "readline";
import path from "path";

// Function to prompt user with yes/no options
function promptUser(question) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

// Main function to run after user confirmation
async function main() {
  // Check if .env file exists
  const envFilePath = ".env";
  if (existsSync(envFilePath)) {
    console.log("Lab Guy Dashboard installation");
    const answer = await promptUser(
      "This script will rewrite existing configuration. Do you want to continue? (yes/no)\n-> "
    );
    if (answer !== "yes") {
      console.log("Configuration update cancelled.");
      return;
    }
  }

  // Prompt user for SERVER_API_URL
  const apiUrl = await promptUser("Please Enter Server API URL: ");

  // Update .env file with SERVER_API_URL
  writeFileSync(envFilePath, `SERVER_API_URL=${apiUrl}\n`);

  console.log("Tinymce configuration...");
  const topDir = import.meta.dirname;
  fse.emptyDirSync(path.join(topDir, "public", "tinymce"));
  fse.copySync(
    path.join(topDir, "node_modules", "tinymce"),
    path.join(topDir, "public", "tinymce"),
    { overwrite: true }
  );
  console.log("Tinymce configured.");

  console.log(
    "Thank you. Configuration complete. You may remove postinstall.js file from your root directory."
  );
}

main().catch((err) => {
  console.error("Error during configuration:", err);
});
