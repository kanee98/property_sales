import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

function resolveUploadsDir() {
  const explicit = process.env.UPLOADS_DIR;
  if (explicit) {
    return path.join(explicit, "property-images");
  }

  const candidates = [
    path.join(process.cwd(), "uploads", "property-images"),
    path.join(process.cwd(), "..", "uploads", "property-images"),
  ];

  const existing = candidates.find((dir) => fs.existsSync(dir));
  return existing ?? candidates[0];
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { filename } = req.query;

  if (!filename || typeof filename !== "string") {
    return res.status(400).json({ error: "Filename is required" });
  }

  const safeName = path.basename(filename);
  const filePath = path.join(resolveUploadsDir(), safeName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  const ext = path.extname(filePath).toLowerCase();
  let contentType = "application/octet-stream";
  if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
  else if (ext === ".png") contentType = "image/png";
  else if (ext === ".webp") contentType = "image/webp";

  const fileBuffer = fs.readFileSync(filePath);
  res.setHeader("Content-Type", contentType);
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.send(fileBuffer);
}
