import { IncomingForm, File } from "formidable";
import path from "path";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const uploadDir = path.join(process.cwd(), "uploads/property-images");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Error parsing the form" });
    }

    const fileField = files.file;
    const uploadedFile: File | undefined = Array.isArray(fileField) ? fileField[0] : fileField;

    if (!uploadedFile || !uploadedFile.filepath) {
      return res.status(400).json({ error: "File not uploaded properly" });
    }

    const fileName = path.basename(uploadedFile.filepath);
    // This URL points to our API route, not public
    const imageUrl = `/api/images/${fileName}`;

    return res.status(200).json({ message: "Upload successful", newImagePath: imageUrl });
  });
}