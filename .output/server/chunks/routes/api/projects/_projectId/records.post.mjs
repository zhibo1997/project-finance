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

const records_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  try {
    const projectId = (_a = event.context.params) == null ? void 0 : _a.projectId;
    const body = await readBody(event);
    const {
      recordType,
      approvalId,
      recordDate,
      amount,
      categoryId,
      description,
      applicant,
      invoiceNo,
      payer,
      attachments,
      remark
    } = body;
    if (!recordType || !approvalId || !recordDate || !amount) {
      return error("\u5FC5\u586B\u5B57\u6BB5\u4E0D\u80FD\u4E3A\u7A7A");
    }
    const record = await prisma.accountingRecord.create({
      data: {
        projectId,
        recordType,
        approvalId,
        recordDate: new Date(recordDate),
        amount: parseFloat(amount),
        categoryId,
        description,
        applicant,
        invoiceNo,
        payer,
        attachments,
        remark,
        createdBy: ((_b = event.context.user) == null ? void 0 : _b.id) || "default",
        createdByName: ((_c = event.context.user) == null ? void 0 : _c.name) || "\u9ED8\u8BA4\u7528\u6237"
      }
    });
    return success(record);
  } catch (err) {
    console.error("\u521B\u5EFA\u8BB0\u8D26\u8BB0\u5F55\u5931\u8D25:", err);
    return error("\u521B\u5EFA\u8BB0\u8D26\u8BB0\u5F55\u5931\u8D25");
  }
});

export { records_post as default };
//# sourceMappingURL=records.post.mjs.map
