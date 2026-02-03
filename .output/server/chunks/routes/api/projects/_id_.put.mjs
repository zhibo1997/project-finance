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

const _id__put = defineEventHandler(async (event) => {
  var _a;
  try {
    const id = (_a = event.context.params) == null ? void 0 : _a.id;
    const body = await readBody(event);
    const {
      projectName,
      projectLeader,
      clientName,
      projectType,
      serviceStartDate,
      serviceEndDate,
      serviceAmount,
      status,
      formData
    } = body;
    const project = await prisma.project.findUnique({
      where: { id }
    });
    if (!project) {
      return error("\u9879\u76EE\u4E0D\u5B58\u5728");
    }
    const updated = await prisma.project.update({
      where: { id },
      data: {
        projectName: projectName || project.projectName,
        projectLeader: projectLeader || project.projectLeader,
        clientName: clientName || project.clientName,
        projectType: projectType || project.projectType,
        serviceStartDate: serviceStartDate ? new Date(serviceStartDate) : project.serviceStartDate,
        serviceEndDate: serviceEndDate ? new Date(serviceEndDate) : project.serviceEndDate,
        serviceAmount: serviceAmount !== void 0 ? Number(serviceAmount) : project.serviceAmount,
        status: status || project.status,
        formData: formData || project.formData
      }
    });
    return success(updated);
  } catch (err) {
    console.error("\u66F4\u65B0\u9879\u76EE\u5931\u8D25:", err);
    return error("\u66F4\u65B0\u9879\u76EE\u5931\u8D25");
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
