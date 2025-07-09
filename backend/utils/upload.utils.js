import { existsSync, unlink, unlinkSync } from "fs";

function deleteFile(path) {
  if (existsSync(path)) {
    unlinkSync(path);
    return true;
  }
  return false;
}

export { deleteFile };
