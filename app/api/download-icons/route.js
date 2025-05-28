import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function GET(req) {
  const folderPath = path.join(process.cwd(), "public/icons"); // Change if needed
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name"); // e.g. solid/home.svg

  if (!name) return NextResponse.json({ error: "No icon name provided" }, { status: 400 });

  const filePath = path.join(process.cwd(), "icons", name);

  try {
    const file = await fs.readFile(filePath, "utf-8");
    return new NextResponse(file, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // const archive = archiver("zip", { zlib: { level: 9 } });
  // const zipStream = new Readable({
  //   read() {},
  // });

  // archive.on("data", (chunk) => zipStream.push(chunk));
  // archive.on("end", () => zipStream.push(null));
  // archive.on("error", (err) => zipStream.destroy(err));

  // archive.directory(folderPath, false);
  // archive.finalize();

  // return new Response(zipStream, {
  //   headers: {
  //     "Content-Type": "application/zip",
  //     "Content-Disposition": 'attachment; filename="icons.zip"',
  //   },
  // });
}
