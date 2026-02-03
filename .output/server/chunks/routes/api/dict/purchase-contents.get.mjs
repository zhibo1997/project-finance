import { c as defineEventHandler } from '../../../_/nitro.mjs';
import { s as success, e as error } from '../../../_/response.mjs';
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

const purchaseContents_get = defineEventHandler(async (event) => {
  try {
    const contents = await prisma.purchaseContent.findMany({
      orderBy: { sortOrder: "asc" }
    });
    return success(contents);
  } catch (err) {
    console.error("\u83B7\u53D6\u91C7\u8D2D\u5185\u5BB9\u5931\u8D25:", err);
    return error("\u83B7\u53D6\u91C7\u8D2D\u5185\u5BB9\u5931\u8D25");
  }
});

export { purchaseContents_get as default };
//# sourceMappingURL=purchase-contents.get.mjs.map
