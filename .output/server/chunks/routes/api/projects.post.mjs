import { c as defineEventHandler, r as readBody } from '../../_/nitro.mjs';
import { e as error, s as success } from '../../_/response.mjs';
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

const projects_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      projectName,
      projectLeader,
      clientName,
      projectType,
      serviceStartDate,
      serviceEndDate,
      formData,
      createdBy = "default"
    } = body;
    if (!projectName || !projectLeader || !clientName || !projectType || !serviceStartDate || !serviceEndDate) {
      return error("\u9879\u76EE\u57FA\u672C\u4FE1\u606F\u4E0D\u80FD\u4E3A\u7A7A");
    }
    const project = await prisma.project.create({
      data: {
        projectName,
        projectLeader,
        clientName,
        projectType,
        serviceStartDate: new Date(serviceStartDate),
        serviceEndDate: new Date(serviceEndDate),
        serviceAmount: 0,
        status: "draft",
        formData,
        createdBy
      }
    });
    return success(project);
  } catch (err) {
    console.error("\u521B\u5EFA\u9879\u76EE\u5931\u8D25:", err);
    return error("\u521B\u5EFA\u9879\u76EE\u5931\u8D25");
  }
});

export { projects_post as default };
//# sourceMappingURL=projects.post.mjs.map
