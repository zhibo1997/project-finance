import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const UPLOAD_DIR = join(process.cwd(), "uploads");
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error2) {
    console.error("\u521B\u5EFA\u4E0A\u4F20\u76EE\u5F55\u5931\u8D25:", error2);
  }
}
function validateFile(file) {
  if (!file) {
    throw new Error("\u672A\u9009\u62E9\u6587\u4EF6");
  }
  if (file.data.length > MAX_FILE_SIZE) {
    throw new Error("\u6587\u4EF6\u5927\u5C0F\u4E0D\u80FD\u8D85\u8FC710MB");
  }
  if (!ALLOWED_TYPES.includes(file.type || "")) {
    throw new Error("\u4EC5\u652F\u6301jpg/png/pdf\u683C\u5F0F");
  }
}
async function saveFile(file) {
  var _a;
  await ensureUploadDir();
  validateFile(file);
  const ext = ((_a = file.filename) == null ? void 0 : _a.split(".").pop()) || "bin";
  const filename = `${randomUUID()}.${ext}`;
  const filepath = join(UPLOAD_DIR, filename);
  await writeFile(filepath, file.data);
  return filename;
}
async function deleteFile(filename) {
  const filepath = join(UPLOAD_DIR, filename);
  try {
    await unlink(filepath);
  } catch (error2) {
    console.error("\u5220\u9664\u6587\u4EF6\u5931\u8D25:", error2);
  }
}

export { deleteFile as d, saveFile as s };
//# sourceMappingURL=upload.mjs.map
