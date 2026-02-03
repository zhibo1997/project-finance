import { c as defineEventHandler, r as readBody } from '../../../_/nitro.mjs';
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

const purchaseContents_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, sortOrder = 0 } = body;
    if (!name) {
      return error("\u91C7\u8D2D\u5185\u5BB9\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A");
    }
    const content = await prisma.purchaseContent.create({
      data: {
        name,
        sortOrder
      }
    });
    return success(content);
  } catch (err) {
    console.error("\u521B\u5EFA\u91C7\u8D2D\u5185\u5BB9\u5931\u8D25:", err);
    return error("\u521B\u5EFA\u91C7\u8D2D\u5185\u5BB9\u5931\u8D25");
  }
});

export { purchaseContents_post as default };
//# sourceMappingURL=purchase-contents.post.mjs.map
