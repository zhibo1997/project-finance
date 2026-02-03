import { c as defineEventHandler, r as readBody } from '../../../../_/nitro.mjs';
import { e as error, s as success } from '../../../../_/response.mjs';
import { p as prisma } from '../../../../_/db.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

const _id__put = defineEventHandler(async (event) => {
  var _a;
  try {
    const id = (_a = event.context.params) == null ? void 0 : _a.id;
    const body = await readBody(event);
    const { name, sortOrder } = body;
    const content = await prisma.purchaseContent.findUnique({
      where: { id }
    });
    if (!content) {
      return error("\u91C7\u8D2D\u5185\u5BB9\u4E0D\u5B58\u5728");
    }
    const updated = await prisma.purchaseContent.update({
      where: { id },
      data: {
        name: name || content.name,
        sortOrder: sortOrder !== void 0 ? sortOrder : content.sortOrder
      }
    });
    return success(updated);
  } catch (err) {
    console.error("\u66F4\u65B0\u91C7\u8D2D\u5185\u5BB9\u5931\u8D25:", err);
    return error("\u66F4\u65B0\u91C7\u8D2D\u5185\u5BB9\u5931\u8D25");
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
