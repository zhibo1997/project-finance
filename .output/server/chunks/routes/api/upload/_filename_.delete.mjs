import { c as defineEventHandler } from '../../../_/nitro.mjs';
import { s as success, e as error } from '../../../_/response.mjs';
import { d as deleteFile } from '../../../_/upload.mjs';
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

const _filename__delete = defineEventHandler(async (event) => {
  var _a;
  try {
    const filename = (_a = event.context.params) == null ? void 0 : _a.filename;
    await deleteFile(filename);
    return success(null, "\u5220\u9664\u6210\u529F");
  } catch (err) {
    console.error("\u6587\u4EF6\u5220\u9664\u5931\u8D25:", err);
    return error("\u6587\u4EF6\u5220\u9664\u5931\u8D25");
  }
});

export { _filename__delete as default };
//# sourceMappingURL=_filename_.delete.mjs.map
