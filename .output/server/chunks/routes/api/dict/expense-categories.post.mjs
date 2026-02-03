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

const expenseCategories_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, sortOrder = 0 } = body;
    if (!name) {
      return error("\u8D39\u7528\u7C7B\u522B\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A");
    }
    const category = await prisma.expenseCategory.create({
      data: {
        name,
        sortOrder
      }
    });
    return success(category);
  } catch (err) {
    console.error("\u521B\u5EFA\u8D39\u7528\u7C7B\u522B\u5931\u8D25:", err);
    return error("\u521B\u5EFA\u8D39\u7528\u7C7B\u522B\u5931\u8D25");
  }
});

export { expenseCategories_post as default };
//# sourceMappingURL=expense-categories.post.mjs.map
