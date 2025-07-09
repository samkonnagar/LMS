import { existsSync, mkdirSync } from "fs";
import multer, { diskStorage } from "multer";
import { resolve } from "path";

function fileUpload(folderName) {
  const storage = diskStorage({
    destination: function (req, file, cb) {
      if (!existsSync(`./uploads/${folderName}/`)) {
        mkdirSync(`./uploads/${folderName}/`);
      }
      cb(null, resolve(`./uploads/${folderName}/`));
    },
    filename: function (req, file, cb) {
      const fileName = `T-${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  });

  const upload = multer({ storage: storage });
  return upload;
}

export { fileUpload };
