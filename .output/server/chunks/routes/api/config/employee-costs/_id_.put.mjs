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
    const { levelKey, levelName, dailyCost } = body;
    const config = await prisma.employeeCostConfig.findUnique({
      where: { id }
    });
    if (!config) {
      return error("\u5458\u5DE5\u6210\u672C\u914D\u7F6E\u4E0D\u5B58\u5728");
    }
    const updated = await prisma.employeeCostConfig.update({
      where: { id },
      data: {
        levelKey: levelKey || config.levelKey,
        levelName: levelName || config.levelName,
        dailyCost: dailyCost !== void 0 ? parseFloat(dailyCost) : config.dailyCost
      }
    });
    return success(updated);
  } catch (err) {
    console.error("\u66F4\u65B0\u5458\u5DE5\u6210\u672C\u914D\u7F6E\u5931\u8D25:", err);
    return error("\u66F4\u65B0\u5458\u5DE5\u6210\u672C\u914D\u7F6E\u5931\u8D25");
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
