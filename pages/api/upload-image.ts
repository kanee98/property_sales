import { IncomingForm, File } from "formidable";
import fs from "fs";
import path from "path";
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

  const form = new IncomingForm({
    uploadDir: path.join(process.cwd(), "public", "img"),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "Error parsing the form" });
    }

    const fileField = files.file;

    // Get the actual file
    const uploadedFile: File | undefined = Array.isArray(fileField) ? fileField[0] : fileField;

    if (!uploadedFile || !uploadedFile.filepath) {
      return res.status(400).json({ error: "File not uploaded properly" });
    }

    const fileName = path.basename(uploadedFile.filepath);
    const imageUrl = `/img/${fileName}`;

    return res.status(200).json({ message: "Upload successful", newImagePath: imageUrl });
  });
}