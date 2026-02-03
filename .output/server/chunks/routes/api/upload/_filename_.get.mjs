import { c as defineEventHandler, f as createError, h as sendStream } from '../../../_/nitro.mjs';
import { existsSync, createReadStream } from 'fs';
import { join } from 'path';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _filename__get = defineEventHandler(async (event) => {
  var _a;
  try {
    const filename = (_a = event.context.params) == null ? void 0 : _a.filename;
    const filepath = join(process.cwd(), "uploads", filename);
    if (!existsSync(filepath)) {
      throw createError({ statusCode: 404, message: "\u6587\u4EF6\u4E0D\u5B58\u5728" });
    }
    return sendStream(event, createReadStream(filepath));
  } catch (err) {
    console.error("\u6587\u4EF6\u4E0B\u8F7D\u5931\u8D25:", err);
    throw err;
  }
});

export { _filename__get as default };
//# sourceMappingURL=_filename_.get.mjs.map
