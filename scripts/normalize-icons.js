const fs = require("fs");
const path = require("path");

const basePath = path.join(__dirname, "../public/icons");

function normalizeFileName(name) {
  return name
    .toLowerCase()
    .replace(/[\s_-]+/g, "-") // Convert multiple spaces, underscores, or dashes to single dash
    .replace(/[^a-z0-9.-]/g, "") // Remove any special characters
    .replace(/-+/g, "-") // Remove multiple dashes
    .replace(/^-+|-+$/g, ""); // Trim leading/trailing dashes
}

function renameAllToLowerAndNormalize(dirPath) {
  const items = fs.readdirSync(dirPath);

  items.forEach((item) => {
    const oldPath = path.join(dirPath, item);
    const stats = fs.statSync(oldPath);

    let normalized = normalizeFileName(item);
    const newPath = path.join(dirPath, normalized);

    // Rename if necessary
    if (item !== normalized) {
      fs.renameSync(oldPath, newPath);
    }

    // If directory, process recursively
    if (stats.isDirectory()) {
      renameAllToLowerAndNormalize(newPath);
    }
  });
}

// Run on icons folder
renameAllToLowerAndNormalize(basePath);
console.log("✅ Folder and file names normalized and converted to lowercase.");
