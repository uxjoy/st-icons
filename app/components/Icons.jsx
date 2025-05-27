import fs from "fs/promises";
import path from "path";
import IconCard from "./IconCard";
import IconsTabView from "./IconsTabView";

async function getIconsByCategory() {
  const baseDir = path.join(process.cwd(), "public/icons");
  const categories = await fs.readdir(baseDir);
  const result = {};

  for (const category of categories) {
    const categoryPath = path.join(baseDir, category);
    console.log(categoryPath);
    const stat = await fs.stat(categoryPath);
    if (stat.isDirectory()) {
      const files = await fs.readdir(categoryPath);
      const svgFiles = files.filter((f) => f.endsWith(".svg"));
      result[category] = svgFiles.map((file) => `${category}/${file}`);
    }
  }

  return result;

  // const dir = path.join(process.cwd(), "public/icons");
  // try {
  //   await fs.access(dir);
  // } catch (error) {
  //   console.error("Icons directory not found:", error);
  //   return [];
  // }

  // const files = await fs.readdir(dir);
  // return files.filter((file) => file.endsWith(".svg"));
}

export default async function IconsPage() {
  const iconsByCategory = await getIconsByCategory();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Icons</h1>
      {/* <div className="grid grid-cols-8 gap-3">
        {iconsByCategory.map((iconPath) => (
          <IconCard iconName={iconPath} key={iconPath} />
        ))}
      </div> */}

      <IconsTabView iconsByCategory={iconsByCategory} />

      {/* {Object.entries(iconsByCategory).map(([category, icons]) => (
        <section key={category} className="mt-12">
          <h2 className="flex items-center gap-1 text-xl font-semibold capitalize mb-4">
            {category}{" "}
            <span className="font-normal text-sm text-slate-500">
              {" "}
              ({icons.length}){" "}
            </span>
          </h2>

          <div className="grid grid-cols-8 gap-3">
            {icons.map((iconPath) => (
              <IconCard key={iconPath} iconName={iconPath} />
            ))}
          </div>
        </section>
      ))} */}
    </main>
  );
}
