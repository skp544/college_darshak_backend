import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      // ✅ Check if folder exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true }); // create folder
      }

      cb(null, uploadDir);
    } catch (error) {
      cb(error as Error, uploadDir);
    }
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s/g, "_");

    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });
