import { c as defineEventHandler } from '../../../../_/nitro.mjs';
import ExcelJS from 'exceljs';
import { e as error } from '../../../../_/response.mjs';
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

const export_get = defineEventHandler(async (event) => {
  var _a;
  try {
    const id = (_a = event.context.params) == null ? void 0 : _a.id;
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return error("\u9879\u76EE\u4E0D\u5B58\u5728");
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("\u9879\u76EE\u8BE6\u60C5");
    worksheet.addRow(["\u9879\u76EE\u540D\u79F0", project.projectName]);
    worksheet.addRow(["\u9879\u76EE\u8D1F\u8D23\u4EBA", project.projectLeader]);
    worksheet.addRow(["\u5BA2\u6237\u540D\u79F0", project.clientName]);
    worksheet.addRow(["\u9879\u76EE\u7C7B\u578B", project.projectType]);
    worksheet.addRow(["\u670D\u52A1\u5F00\u59CB\u65E5\u671F", project.serviceStartDate.toLocaleDateString()]);
    worksheet.addRow(["\u670D\u52A1\u7ED3\u675F\u65E5\u671F", project.serviceEndDate.toLocaleDateString()]);
    worksheet.addRow(["\u670D\u52A1\u91D1\u989D", project.serviceAmount]);
    worksheet.addRow(["\u72B6\u6001", project.status]);
    worksheet.addRow(["\u521B\u5EFA\u65F6\u95F4", project.createdAt.toLocaleString()]);
    worksheet.addRow(["\u66F4\u65B0\u65F6\u95F4", project.updatedAt.toLocaleString()]);
    const membersWorksheet = workbook.addWorksheet("\u9879\u76EE\u6210\u5458");
    membersWorksheet.columns = [
      { header: "\u7528\u6237ID", key: "userId", width: 36 },
      { header: "\u7528\u6237\u59D3\u540D", key: "userName", width: 20 },
      { header: "\u89D2\u8272", key: "role", width: 10 }
    ];
    const members = await prisma.projectMember.findMany({ where: { projectId: id } });
    members.forEach((member) => {
      membersWorksheet.addRow({
        userId: member.userId,
        userName: member.userName,
        role: member.role
      });
    });
    const recordsWorksheet = workbook.addWorksheet("\u9879\u76EE\u8BB0\u5F55");
    recordsWorksheet.columns = [
      { header: "\u8BB0\u5F55ID", key: "id", width: 36 },
      { header: "\u8BB0\u5F55\u7C7B\u578B", key: "recordType", width: 10 },
      { header: "\u5BA1\u6279\u6D41\u7A0B\u5355ID", key: "approvalId", width: 20 },
      { header: "\u8BB0\u8D26\u65E5\u671F", key: "recordDate", width: 15 },
      { header: "\u91D1\u989D", key: "amount", width: 15 },
      { header: "\u8D39\u7528\u7C7B\u522BID", key: "categoryId", width: 36 },
      { header: "\u7528\u9014\u8BF4\u660E", key: "description", width: 50 },
      { header: "\u7533\u8BF7\u4EBA", key: "applicant", width: 20 },
      { header: "\u53D1\u7968\u53F7", key: "invoiceNo", width: 20 },
      { header: "\u4ED8\u6B3E\u65B9", key: "payer", width: 30 },
      { header: "\u5907\u6CE8", key: "remark", width: 50 },
      { header: "\u8BB0\u8D26\u4EBAID", key: "createdBy", width: 36 },
      { header: "\u8BB0\u8D26\u4EBA\u59D3\u540D", key: "createdByName", width: 20 },
      { header: "\u521B\u5EFA\u65F6\u95F4", key: "createdAt", width: 20 },
      { header: "\u66F4\u65B0\u65F6\u95F4", key: "updatedAt", width: 20 }
    ];
    const records = await prisma.accountingRecord.findMany({ where: { projectId: id } });
    records.forEach((record) => {
      recordsWorksheet.addRow({
        id: record.id,
        recordType: record.recordType,
        approvalId: record.approvalId,
        recordDate: record.recordDate.toLocaleDateString(),
        amount: record.amount,
        categoryId: record.categoryId,
        description: record.description,
        applicant: record.applicant,
        invoiceNo: record.invoiceNo,
        payer: record.payer,
        remark: record.remark,
        createdBy: record.createdBy,
        createdByName: record.createdByName,
        createdAt: record.createdAt.toLocaleString(),
        updatedAt: record.updatedAt.toLocaleString()
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    event.node.res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    event.node.res.setHeader("Content-Disposition", `attachment; filename="${project.projectName}_\u8BE6\u60C5.xlsx"`);
    return buffer;
  } catch (err) {
    console.error("\u5BFC\u51FA\u9879\u76EE\u5931\u8D25:", err);
    return error("\u5BFC\u51FA\u9879\u76EE\u5931\u8D25");
  }
});

export { export_get as default };
//# sourceMappingURL=export.get.mjs.map
