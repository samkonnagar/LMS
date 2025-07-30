import { existsSync, unlinkSync } from "fs";
import { resolve } from "path";

function deleteFile(path) {
  path = resolve(path);
  if (existsSync(path)) {
    unlinkSync(path);
    return true;
  }
  return false;
}

export { deleteFile };
