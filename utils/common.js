import fs from "fs/promises";
import path from "path";

export const getIconsByCategory = async () => {
  const baseDir = path.join(process.cwd(), "public/icons");
  const categories = await fs.readdir(baseDir);
  const result = {};

  for (const category of categories) {
    const categoryPath = path.join(baseDir, category);
    // console.log(categoryPath);

    const stat = await fs.stat(categoryPath);
    if (stat.isDirectory()) {
      const files = await fs.readdir(categoryPath);
      const svgFiles = files.filter((f) => f.endsWith(".svg"));
      result[category] = svgFiles.map((file) => `${category}/${file}`);
    }
  }

  return result;
};
