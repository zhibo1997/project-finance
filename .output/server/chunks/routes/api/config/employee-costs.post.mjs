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

const employeeCosts_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { levelKey, levelName, dailyCost } = body;
    if (!levelKey || !levelName || dailyCost === void 0) {
      return error("\u7EA7\u522B\u6807\u8BC6\u3001\u7EA7\u522B\u540D\u79F0\u548C\u65E5\u6210\u672C\u4E0D\u80FD\u4E3A\u7A7A");
    }
    const config = await prisma.employeeCostConfig.create({
      data: {
        levelKey,
        levelName,
        dailyCost: parseFloat(dailyCost)
      }
    });
    return success(config);
  } catch (err) {
    console.error("\u521B\u5EFA\u5458\u5DE5\u6210\u672C\u914D\u7F6E\u5931\u8D25:", err);
    return error("\u521B\u5EFA\u5458\u5DE5\u6210\u672C\u914D\u7F6E\u5931\u8D25");
  }
});

export { employeeCosts_post as default };
//# sourceMappingURL=employee-costs.post.mjs.map
