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

const _id__delete = defineEventHandler(async (event) => {
  var _a;
  try {
    const id = (_a = event.context.params) == null ? void 0 : _a.id;
    const project = await prisma.project.findUnique({
      where: { id }
    });
    if (!project) {
      return error("\u9879\u76EE\u4E0D\u5B58\u5728");
    }
    await prisma.project.delete({
      where: { id }
    });
    return success(null, "\u5220\u9664\u6210\u529F");
  } catch (err) {
    console.error("\u5220\u9664\u9879\u76EE\u5931\u8D25:", err);
    return error("\u5220\u9664\u9879\u76EE\u5931\u8D25");
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
