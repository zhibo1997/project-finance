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

const expenseCategories_get = defineEventHandler(async (event) => {
  try {
    const categories = await prisma.expenseCategory.findMany({
      orderBy: { sortOrder: "asc" }
    });
    return success(categories);
  } catch (err) {
    console.error("\u83B7\u53D6\u8D39\u7528\u7C7B\u522B\u5931\u8D25:", err);
    return error("\u83B7\u53D6\u8D39\u7528\u7C7B\u522B\u5931\u8D25");
  }
});

export { expenseCategories_get as default };
//# sourceMappingURL=expense-categories.get.mjs.map
