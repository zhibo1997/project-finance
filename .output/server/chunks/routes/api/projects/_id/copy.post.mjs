import { c as defineEventHandler } from '../../../../_/nitro.mjs';
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

const copy_post = defineEventHandler(async (event) => {
  var _a;
  try {
    const id = (_a = event.context.params) == null ? void 0 : _a.id;
    const original = await prisma.project.findUnique({ where: { id } });
    if (!original) {
      return error("\u9879\u76EE\u4E0D\u5B58\u5728");
    }
    const formData = original.formData;
    formData.basicInfo.projectName = `${formData.basicInfo.projectName} copy`;
    const newProject = await prisma.project.create({
      data: {
        ...original,
        id: void 0,
        status: "draft",
        formData,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }
    });
    return success(newProject);
  } catch (err) {
    console.error("\u590D\u5236\u9879\u76EE\u5931\u8D25:", err);
    return error("\u590D\u5236\u9879\u76EE\u5931\u8D25");
  }
});

export { copy_post as default };
//# sourceMappingURL=copy.post.mjs.map
