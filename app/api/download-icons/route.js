import archiver from "archiver";
import path from "path";
import { Readable } from "stream";

export async function GET(req) {
  const folderPath = path.join(process.cwd(), "public/icons"); // Change if needed

  const archive = archiver("zip", { zlib: { level: 9 } });
  const zipStream = new Readable({
    read() {},
  });

  archive.on("data", (chunk) => zipStream.push(chunk));
  archive.on("end", () => zipStream.push(null));
  archive.on("error", (err) => zipStream.destroy(err));

  archive.directory(folderPath, false);
  archive.finalize();

  return new Response(zipStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="icons.zip"',
    },
  });
}
