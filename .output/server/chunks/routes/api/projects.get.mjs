import { c as defineEventHandler, g as getQuery } from '../../_/nitro.mjs';
import { s as success, e as error } from '../../_/response.mjs';
import { p as prisma } from '../../_/db.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

const projects_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { keyword, status, page = 1, size = 20 } = query;
    const where = {};
    if (status) where.status = status;
    if (keyword) {
      where.OR = [
        { projectName: { contains: keyword } },
        { clientName: { contains: keyword } },
        { projectLeader: { contains: keyword } }
      ];
    }
    const [total, list] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (Number(page) - 1) * Number(size),
        take: Number(size)
      })
    ]);
    return success({ total, list, page: Number(page), size: Number(size) });
  } catch (err) {
    console.error("\u83B7\u53D6\u9879\u76EE\u5217\u8868\u5931\u8D25:", err);
    return error("\u83B7\u53D6\u9879\u76EE\u5217\u8868\u5931\u8D25");
  }
});

export { projects_get as default };
//# sourceMappingURL=projects.get.mjs.map
