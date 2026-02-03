import { c as defineEventHandler, e as readMultipartFormData } from '../../_/nitro.mjs';
import { e as error, s as success } from '../../_/response.mjs';
import { s as saveFile } from '../../_/upload.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'fs/promises';
import 'path';
import 'crypto';

const upload_post = defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);
    const file = formData == null ? void 0 : formData.find((f) => f.name === "file");
    if (!file) {
      return error("\u672A\u9009\u62E9\u6587\u4EF6");
    }
    const filename = await saveFile(file);
    const url = `/api/upload/${filename}`;
    return success({ filename, url });
  } catch (err) {
    console.error("\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25:", err);
    return error(err.message || "\u6587\u4EF6\u4E0A\u4F20\u5931\u8D25");
  }
});

export { upload_post as default };
//# sourceMappingURL=upload.post.mjs.map
