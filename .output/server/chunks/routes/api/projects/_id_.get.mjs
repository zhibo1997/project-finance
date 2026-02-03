import { c as defineEventHandler } from '../../../_/nitro.mjs';
import { e as error, s as success } from '../../../_/response.mjs';
import { p as prisma } from '../../../_/db.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

const _id__get = defineEventHandler(async (event) => {
  var _a;
  try {
    const id = (_a = event.context.params) == null ? void 0 : _a.id;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        members: true,
        records: true
      }
    });
    if (!project) {
      return error("\u9879\u76EE\u4E0D\u5B58\u5728");
    }
    return success(project);
  } catch (err) {
    console.error("\u83B7\u53D6\u9879\u76EE\u8BE6\u60C5\u5931\u8D25:", err);
    return error("\u83B7\u53D6\u9879\u76EE\u8BE6\u60C5\u5931\u8D25");
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
