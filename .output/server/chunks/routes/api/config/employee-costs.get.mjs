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

const employeeCosts_get = defineEventHandler(async (event) => {
  try {
    const configs = await prisma.employeeCostConfig.findMany();
    return success(configs);
  } catch (err) {
    console.error("\u83B7\u53D6\u5458\u5DE5\u6210\u672C\u914D\u7F6E\u5931\u8D25:", err);
    return error("\u83B7\u53D6\u5458\u5DE5\u6210\u672C\u914D\u7F6E\u5931\u8D25");
  }
});

export { employeeCosts_get as default };
//# sourceMappingURL=employee-costs.get.mjs.map
