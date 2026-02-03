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

async function getUserRoleInProject(projectId, userId) {
  const member = await prisma.projectMember.findFirst({
    where: { projectId, userId }
  });
  return (member == null ? void 0 : member.role) || "member";
}
const _id__put = defineEventHandler(async (event) => {
  var _a, _b;
  try {
    const id = (_a = event.context.params) == null ? void 0 : _a.id;
    const userId = (_b = event.context.user) == null ? void 0 : _b.id;
    const body = await readBody(event);
    const record = await prisma.accountingRecord.findUnique({ where: { id } });
    if (!record) return error("\u8BB0\u5F55\u4E0D\u5B58\u5728");
    const userRole = await getUserRoleInProject(record.projectId, userId);
    if (userRole === "member" && record.createdBy !== userId) {
      return error("\u65E0\u6743\u9650\u4FEE\u6539\u6B64\u8BB0\u5F55");
    }
    const updated = await prisma.accountingRecord.update({
      where: { id },
      data: {
        ...body,
        recordDate: body.recordDate ? new Date(body.recordDate) : record.recordDate,
        amount: body.amount !== void 0 ? parseFloat(body.amount) : record.amount,
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    return success(updated);
  } catch (err) {
    console.error("\u66F4\u65B0\u8BB0\u8D26\u8BB0\u5F55\u5931\u8D25:", err);
    return error("\u66F4\u65B0\u8BB0\u8D26\u8BB0\u5F55\u5931\u8D25");
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
