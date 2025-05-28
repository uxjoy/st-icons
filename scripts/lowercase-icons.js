const fs = require("fs");
const path = require("path");

const basePath = path.join(__dirname, "../public/icons");

// Recursively rename all files and folders to lowercase
function renameAllToLower(dirPath) {
  const items = fs.readdirSync(dirPath);

  items.forEach((item) => {
    const oldPath = path.join(dirPath, item);
    const stats = fs.statSync(oldPath);

    const lowerName = item.toLowerCase();
    const newPath = path.join(dirPath, lowerName);

    // If name already lowercase, no need to rename
    if (item !== lowerName) {
      fs.renameSync(oldPath, newPath);
    }

    // If it's a directory, recurse into it
    if (stats.isDirectory()) {
      renameAllToLower(newPath);
    }
  });
}

// Run the function on your base icons folder
renameAllToLower(basePath);

console.log(
  "✅ All folder and file names in /public/icons converted to lowercase."
);
