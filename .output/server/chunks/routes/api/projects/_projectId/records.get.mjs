import { c as defineEventHandler } from '../../../../_/nitro.mjs';
import { s as success, e as error } from '../../../../_/response.mjs';
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

async function getUserRoleInProject(projectId, userId) {
  const member = await prisma.projectMember.findFirst({
    where: { projectId, userId }
  });
  return (member == null ? void 0 : member.role) || "member";
}
const records_get = defineEventHandler(async (event) => {
  var _a, _b;
  try {
    const projectId = (_a = event.context.params) == null ? void 0 : _a.projectId;
    const userId = (_b = event.context.user) == null ? void 0 : _b.id;
    const userRole = await getUserRoleInProject(projectId, userId);
    const records = await prisma.accountingRecord.findMany({
      where: { projectId },
      orderBy: { recordDate: "desc" }
    });
    if (userRole === "member") {
      return success(records.map((r) => ({
        ...r,
        createdBy: void 0,
        createdByName: void 0
      })));
    }
    return success(records);
  } catch (err) {
    console.error("\u83B7\u53D6\u8BB0\u8D26\u8BB0\u5F55\u5931\u8D25:", err);
    return error("\u83B7\u53D6\u8BB0\u8D26\u8BB0\u5F55\u5931\u8D25");
  }
});

export { records_get as default };
//# sourceMappingURL=records.get.mjs.map
