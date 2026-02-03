import { _ as __nuxt_component_0 } from './Layout-Bn7f3IU0.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-Br-Hzc18.mjs';
import { defineComponent, ref, computed, withCtx, createTextVNode, createVNode, openBlock, createBlock, toDisplayString, Fragment, renderList, createCommentVNode, withDirectives, vModelSelect, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { _ as _export_sfc, u as useRoute, n as navigateTo } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const id = route.params.id;
    const project = ref(null);
    const records = ref([]);
    const recordType = ref("");
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    };
    const formatDateTime = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString();
    };
    const getStatusText = (status) => {
      const statusMap = {
        draft: "\u8349\u7A3F",
        submitted: "\u5DF2\u63D0\u4EA4",
        completed: "\u5DF2\u5B8C\u6210",
        closed: "\u5DF2\u7ED3\u9879"
      };
      return statusMap[status] || status;
    };
    const getStatusClass = (status) => {
      const statusMap = {
        draft: "status-draft",
        submitted: "status-submitted",
        completed: "status-completed",
        closed: "status-closed"
      };
      return statusMap[status] || "";
    };
    const filteredRecords = computed(() => {
      if (!recordType.value) {
        return records.value;
      }
      return records.value.filter((record) => record.recordType === recordType.value);
    });
    const fetchProject = async () => {
      try {
        const response = await $fetch(`/api/projects/${id}`);
        if ((response == null ? void 0 : response.code) === 0) {
          project.value = response.data;
        }
      } catch (error2) {
        console.error("\u83B7\u53D6\u9879\u76EE\u8BE6\u60C5\u5931\u8D25:", error2);
      }
    };
    const fetchRecords = async () => {
      try {
        const response = await $fetch(`/api/projects/${id}/records`);
        if ((response == null ? void 0 : response.code) === 0) {
          records.value = response.data;
        }
      } catch (error2) {
        console.error("\u83B7\u53D6\u8BB0\u8D26\u8BB0\u5F55\u5931\u8D25:", error2);
      }
    };
    const copyProject = async () => {
      try {
        const response = await $fetch(`/api/projects/${id}/copy`, {
          method: "POST"
        });
        if ((response == null ? void 0 : response.code) === 0) {
          alert("\u9879\u76EE\u590D\u5236\u6210\u529F");
          await fetchProject();
        } else {
          alert((response == null ? void 0 : response.message) || "\u590D\u5236\u9879\u76EE\u5931\u8D25");
        }
      } catch (error2) {
        console.error("\u590D\u5236\u9879\u76EE\u5931\u8D25:", error2);
        alert("\u590D\u5236\u9879\u76EE\u5931\u8D25");
      }
    };
    const exportProject = async () => {
      var _a, _b;
      try {
        const response = await $fetch(`/api/projects/${id}/export`, {
          responseType: "blob"
        });
        const url = (void 0).URL.createObjectURL(new Blob([response]));
        const link = (void 0).createElement("a");
        link.href = url;
        link.setAttribute("download", `${(_a = project.value) == null ? void 0 : _a.projectName}_\u8BE6\u60C5.xlsx`);
        (void 0).body.appendChild(link);
        link.click();
        (_b = link.parentNode) == null ? void 0 : _b.removeChild(link);
        (void 0).URL.revokeObjectURL(url);
      } catch (error2) {
        console.error("\u5BFC\u51FA\u9879\u76EE\u5931\u8D25:", error2);
        alert("\u5BFC\u51FA\u9879\u76EE\u5931\u8D25");
      }
    };
    const deleteProject = async () => {
      if (!confirm("\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u9879\u76EE\u5417\uFF1F")) {
        return;
      }
      try {
        const response = await $fetch(`/api/projects/${id}`, {
          method: "DELETE"
        });
        if ((response == null ? void 0 : response.code) === 0) {
          alert("\u9879\u76EE\u5220\u9664\u6210\u529F");
          navigateTo("/projects");
        } else {
          alert((response == null ? void 0 : response.message) || "\u5220\u9664\u9879\u76EE\u5931\u8D25");
        }
      } catch (error2) {
        console.error("\u5220\u9664\u9879\u76EE\u5931\u8D25:", error2);
        alert("\u5220\u9664\u9879\u76EE\u5931\u8D25");
      }
    };
    const deleteRecord = async (recordId) => {
      if (!confirm("\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u8BB0\u8D26\u8BB0\u5F55\u5417\uFF1F")) {
        return;
      }
      try {
        const response = await $fetch(`/api/records/${recordId}`, {
          method: "DELETE"
        });
        if ((response == null ? void 0 : response.code) === 0) {
          alert("\u8BB0\u5F55\u5220\u9664\u6210\u529F");
          await fetchRecords();
        } else {
          alert((response == null ? void 0 : response.message) || "\u5220\u9664\u8BB0\u5F55\u5931\u8D25");
        }
      } catch (error2) {
        console.error("\u5220\u9664\u8BB0\u5F55\u5931\u8D25:", error2);
        alert("\u5220\u9664\u8BB0\u5F55\u5931\u8D25");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Layout = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_Layout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="project-detail" data-v-8dd3447a${_scopeId}><div class="page-header" data-v-8dd3447a${_scopeId}><h2 data-v-8dd3447a${_scopeId}>\u9879\u76EE\u8BE6\u60C5</h2><div class="header-actions" data-v-8dd3447a${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: `/projects/${project.value.id}/edit`,
              class: "btn btn-secondary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u7F16\u8F91`);
                } else {
                  return [
                    createTextVNode("\u7F16\u8F91")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<button class="btn btn-secondary" data-v-8dd3447a${_scopeId}>\u590D\u5236</button><button class="btn btn-secondary" data-v-8dd3447a${_scopeId}>\u5BFC\u51FAExcel</button><button class="btn btn-secondary" style="${ssrRenderStyle({ "background-color": "#ff4d4f", "color": "white" })}" data-v-8dd3447a${_scopeId}>\u5220\u9664</button></div></div>`);
            if (project.value) {
              _push2(`<div class="project-content" data-v-8dd3447a${_scopeId}><div class="project-info" data-v-8dd3447a${_scopeId}><h3 data-v-8dd3447a${_scopeId}>${ssrInterpolate(project.value.projectName)}</h3><p data-v-8dd3447a${_scopeId}>\u8D1F\u8D23\u4EBA: ${ssrInterpolate(project.value.projectLeader)}</p><p data-v-8dd3447a${_scopeId}>\u5BA2\u6237: ${ssrInterpolate(project.value.clientName)}</p><p data-v-8dd3447a${_scopeId}>\u9879\u76EE\u7C7B\u578B: ${ssrInterpolate(project.value.projectType)}</p><p data-v-8dd3447a${_scopeId}>\u670D\u52A1\u65E5\u671F: ${ssrInterpolate(formatDate(project.value.serviceStartDate))} - ${ssrInterpolate(formatDate(project.value.serviceEndDate))}</p><p data-v-8dd3447a${_scopeId}>\u670D\u52A1\u91D1\u989D: \xA5${ssrInterpolate(project.value.serviceAmount.toFixed(2))}</p><p data-v-8dd3447a${_scopeId}>\u72B6\u6001: <span class="${ssrRenderClass(getStatusClass(project.value.status))}" data-v-8dd3447a${_scopeId}>${ssrInterpolate(getStatusText(project.value.status))}</span></p><p data-v-8dd3447a${_scopeId}>\u521B\u5EFA\u65F6\u95F4: ${ssrInterpolate(formatDateTime(project.value.createdAt))}</p><p data-v-8dd3447a${_scopeId}>\u66F4\u65B0\u65F6\u95F4: ${ssrInterpolate(formatDateTime(project.value.updatedAt))}</p></div>`);
              if (project.value.formData) {
                _push2(`<div class="project-form-data" data-v-8dd3447a${_scopeId}><h3 data-v-8dd3447a${_scopeId}>\u9879\u76EE\u8868\u5355\u6570\u636E</h3><div class="form-section" data-v-8dd3447a${_scopeId}><h4 data-v-8dd3447a${_scopeId}>\u57FA\u7840\u4FE1\u606F</h4><p data-v-8dd3447a${_scopeId}>\u9879\u76EE\u80CC\u666F: ${ssrInterpolate(project.value.formData.basicInfo.projectBackground)}</p><p data-v-8dd3447a${_scopeId}>\u5BA2\u6237\u9700\u6C42: ${ssrInterpolate(project.value.formData.basicInfo.clientDemand)}</p><p data-v-8dd3447a${_scopeId}>\u670D\u52A1\u5185\u5BB9: ${ssrInterpolate(project.value.formData.basicInfo.serviceContent)}</p><p data-v-8dd3447a${_scopeId}>\u9879\u76EE\u6210\u5458: ${ssrInterpolate(project.value.formData.basicInfo.projectMembers.join(", "))}</p></div>`);
                if (project.value.formData.serviceIncome && project.value.formData.serviceIncome.length > 0) {
                  _push2(`<div class="form-section" data-v-8dd3447a${_scopeId}><h4 data-v-8dd3447a${_scopeId}>\u670D\u52A1\u6536\u5165</h4><table class="table" data-v-8dd3447a${_scopeId}><thead data-v-8dd3447a${_scopeId}><tr data-v-8dd3447a${_scopeId}><th data-v-8dd3447a${_scopeId}>\u91C7\u8D2D\u5185\u5BB9</th><th data-v-8dd3447a${_scopeId}>\u5FC5\u8981\u6027\u63CF\u8FF0</th><th data-v-8dd3447a${_scopeId}>\u542B\u7A0E\u91D1\u989D</th><th data-v-8dd3447a${_scopeId}>\u7A0E\u7387</th><th data-v-8dd3447a${_scopeId}>\u4E0D\u542B\u7A0E\u91D1\u989D</th></tr></thead><tbody data-v-8dd3447a${_scopeId}><!--[-->`);
                  ssrRenderList(project.value.formData.serviceIncome, (item) => {
                    _push2(`<tr data-v-8dd3447a${_scopeId}><td data-v-8dd3447a${_scopeId}>${ssrInterpolate(item.purchaseContent)}</td><td data-v-8dd3447a${_scopeId}>${ssrInterpolate(item.necessityDesc)}</td><td data-v-8dd3447a${_scopeId}>\xA5${ssrInterpolate(item.amount.toFixed(2))}</td><td data-v-8dd3447a${_scopeId}>${ssrInterpolate(item.taxRate)}%</td><td data-v-8dd3447a${_scopeId}>\xA5${ssrInterpolate((item.amount / (1 + item.taxRate / 100)).toFixed(2))}</td></tr>`);
                  });
                  _push2(`<!--]--></tbody></table></div>`);
                } else {
                  _push2(`<!---->`);
                }
                if (project.value.formData.outsourcingCost && project.value.formData.outsourcingCost.length > 0) {
                  _push2(`<div class="form-section" data-v-8dd3447a${_scopeId}><h4 data-v-8dd3447a${_scopeId}>\u5916\u91C7\u6210\u672C</h4><table class="table" data-v-8dd3447a${_scopeId}><thead data-v-8dd3447a${_scopeId}><tr data-v-8dd3447a${_scopeId}><th data-v-8dd3447a${_scopeId}>\u91C7\u8D2D\u5185\u5BB9</th><th data-v-8dd3447a${_scopeId}>\u5355\u4EF7</th><th data-v-8dd3447a${_scopeId}>\u6570\u91CF</th><th data-v-8dd3447a${_scopeId}>\u603B\u4EF7</th></tr></thead><tbody data-v-8dd3447a${_scopeId}><!--[-->`);
                  ssrRenderList(project.value.formData.outsourcingCost, (item) => {
                    _push2(`<tr data-v-8dd3447a${_scopeId}><td data-v-8dd3447a${_scopeId}>${ssrInterpolate(item.content)}</td><td data-v-8dd3447a${_scopeId}>\xA5${ssrInterpolate(item.unitPrice.toFixed(2))}</td><td data-v-8dd3447a${_scopeId}>${ssrInterpolate(item.quantity)}</td><td data-v-8dd3447a${_scopeId}>\xA5${ssrInterpolate((item.unitPrice * item.quantity).toFixed(2))}</td></tr>`);
                  });
                  _push2(`<!--]--></tbody></table></div>`);
                } else {
                  _push2(`<!---->`);
                }
                if (project.value.formData.laborCost && project.value.formData.laborCost.length > 0) {
                  _push2(`<div class="form-section" data-v-8dd3447a${_scopeId}><h4 data-v-8dd3447a${_scopeId}>\u4EBA\u5DE5\u6210\u672C</h4><table class="table" data-v-8dd3447a${_scopeId}><thead data-v-8dd3447a${_scopeId}><tr data-v-8dd3447a${_scopeId}><th data-v-8dd3447a${_scopeId}>\u5458\u5DE5\u59D3\u540D</th><th data-v-8dd3447a${_scopeId}>\u5458\u5DE5\u7EA7\u522B</th><th data-v-8dd3447a${_scopeId}>\u65E5\u6210\u672C</th><th data-v-8dd3447a${_scopeId}>\u6295\u5165\u5929\u6570</th><th data-v-8dd3447a${_scopeId}>\u603B\u6210\u672C</th></tr></thead><tbody data-v-8dd3447a${_scopeId}><!--[-->`);
                  ssrRenderList(project.value.formData.laborCost, (item) => {
                    _push2(`<tr data-v-8dd3447a${_scopeId}><td data-v-8dd3447a${_scopeId}>${ssrInterpolate(item.employeeName)}</td><td data-v-8dd3447a${_scopeId}>${ssrInterpolate(item.level)}</td><td data-v-8dd3447a${_scopeId}>\xA5${ssrInterpolate(item.dailyCost.toFixed(2))}</td><td data-v-8dd3447a${_scopeId}>${ssrInterpolate(item.days)}</td><td data-v-8dd3447a${_scopeId}>\xA5${ssrInterpolate((item.dailyCost * item.days).toFixed(2))}</td></tr>`);
                  });
                  _push2(`<!--]--></tbody></table></div>`);
                } else {
                  _push2(`<!---->`);
                }
                if (project.value.formData.otherExpenses && project.value.formData.otherExpenses.length > 0) {
                  _push2(`<div class="form-section" data-v-8dd3447a${_scopeId}><h4 data-v-8dd3447a${_scopeId}>\u5176\u4ED6\u8D39\u7528</h4><table class="table" data-v-8dd3447a${_scopeId}><thead data-v-8dd3447a${_scopeId}><tr data-v-8dd3447a${_scopeId}><th data-v-8dd3447a${_scopeId}>\u8D39\u7528\u7C7B\u578B</th><th data-v-8dd3447a${_scopeId}>\u91D1\u989D</th></tr></thead><tbody data-v-8dd3447a${_scopeId}><!--[-->`);
                  ssrRenderList(project.value.formData.otherExpenses, (item) => {
                    _push2(`<tr data-v-8dd3447a${_scopeId}><td data-v-8dd3447a${_scopeId}>${ssrInterpolate(item.category)}</td><td data-v-8dd3447a${_scopeId}>\xA5${ssrInterpolate(item.amount.toFixed(2))}</td></tr>`);
                  });
                  _push2(`<!--]--></tbody></table></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="project-records" data-v-8dd3447a${_scopeId}><h3 data-v-8dd3447a${_scopeId}>\u8BB0\u8D26\u8BB0\u5F55</h3><div class="record-filters" data-v-8dd3447a${_scopeId}><select class="record-type-select" data-v-8dd3447a${_scopeId}><option value="" data-v-8dd3447a${ssrIncludeBooleanAttr(Array.isArray(recordType.value) ? ssrLooseContain(recordType.value, "") : ssrLooseEqual(recordType.value, "")) ? " selected" : ""}${_scopeId}>\u6240\u6709\u7C7B\u578B</option><option value="income" data-v-8dd3447a${ssrIncludeBooleanAttr(Array.isArray(recordType.value) ? ssrLooseContain(recordType.value, "income") : ssrLooseEqual(recordType.value, "income")) ? " selected" : ""}${_scopeId}>\u6536\u5165</option><option value="expense" data-v-8dd3447a${ssrIncludeBooleanAttr(Array.isArray(recordType.value) ? ssrLooseContain(recordType.value, "expense") : ssrLooseEqual(recordType.value, "expense")) ? " selected" : ""}${_scopeId}>\u652F\u51FA</option></select>`);
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: "/accounting/new",
                class: "btn btn-primary"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`\u65B0\u589E\u8BB0\u8D26`);
                  } else {
                    return [
                      createTextVNode("\u65B0\u589E\u8BB0\u8D26")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div><table class="table" data-v-8dd3447a${_scopeId}><thead data-v-8dd3447a${_scopeId}><tr data-v-8dd3447a${_scopeId}><th data-v-8dd3447a${_scopeId}>\u8BB0\u5F55\u7C7B\u578B</th><th data-v-8dd3447a${_scopeId}>\u5BA1\u6279\u6D41\u7A0B\u5355ID</th><th data-v-8dd3447a${_scopeId}>\u8BB0\u8D26\u65E5\u671F</th><th data-v-8dd3447a${_scopeId}>\u91D1\u989D</th><th data-v-8dd3447a${_scopeId}>\u8D39\u7528\u7C7B\u522B</th><th data-v-8dd3447a${_scopeId}>\u7528\u9014\u8BF4\u660E</th><th data-v-8dd3447a${_scopeId}>\u7533\u8BF7\u4EBA</th><th data-v-8dd3447a${_scopeId}>\u53D1\u7968\u53F7</th><th data-v-8dd3447a${_scopeId}>\u4ED8\u6B3E\u65B9</th><th data-v-8dd3447a${_scopeId}>\u5907\u6CE8</th><th data-v-8dd3447a${_scopeId}>\u64CD\u4F5C</th></tr></thead><tbody data-v-8dd3447a${_scopeId}><!--[-->`);
              ssrRenderList(filteredRecords.value, (record) => {
                _push2(`<tr data-v-8dd3447a${_scopeId}><td data-v-8dd3447a${_scopeId}>${ssrInterpolate(record.recordType === "income" ? "\u6536\u5165" : "\u652F\u51FA")}</td><td data-v-8dd3447a${_scopeId}>${ssrInterpolate(record.approvalId)}</td><td data-v-8dd3447a${_scopeId}>${ssrInterpolate(formatDate(record.recordDate))}</td><td data-v-8dd3447a${_scopeId}>\xA5${ssrInterpolate(record.amount.toFixed(2))}</td><td data-v-8dd3447a${_scopeId}>${ssrInterpolate(record.categoryName)}</td><td data-v-8dd3447a${_scopeId}>${ssrInterpolate(record.description)}</td><td data-v-8dd3447a${_scopeId}>${ssrInterpolate(record.applicant)}</td><td data-v-8dd3447a${_scopeId}>${ssrInterpolate(record.invoiceNo)}</td><td data-v-8dd3447a${_scopeId}>${ssrInterpolate(record.payer)}</td><td data-v-8dd3447a${_scopeId}>${ssrInterpolate(record.remark)}</td><td data-v-8dd3447a${_scopeId}>`);
                _push2(ssrRenderComponent(_component_NuxtLink, {
                  to: `/accounting/${record.id}/edit`,
                  class: "btn btn-secondary"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`\u7F16\u8F91`);
                    } else {
                      return [
                        createTextVNode("\u7F16\u8F91")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<button class="btn btn-secondary" data-v-8dd3447a${_scopeId}>\u5220\u9664</button></td></tr>`);
              });
              _push2(`<!--]--></tbody></table></div></div>`);
            } else {
              _push2(`<div class="loading" data-v-8dd3447a${_scopeId}> \u52A0\u8F7D\u4E2D... </div>`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "project-detail" }, [
                createVNode("div", { class: "page-header" }, [
                  createVNode("h2", null, "\u9879\u76EE\u8BE6\u60C5"),
                  createVNode("div", { class: "header-actions" }, [
                    createVNode(_component_NuxtLink, {
                      to: `/projects/${project.value.id}/edit`,
                      class: "btn btn-secondary"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u7F16\u8F91")
                      ]),
                      _: 1
                    }, 8, ["to"]),
                    createVNode("button", {
                      onClick: copyProject,
                      class: "btn btn-secondary"
                    }, "\u590D\u5236"),
                    createVNode("button", {
                      onClick: exportProject,
                      class: "btn btn-secondary"
                    }, "\u5BFC\u51FAExcel"),
                    createVNode("button", {
                      onClick: deleteProject,
                      class: "btn btn-secondary",
                      style: { "background-color": "#ff4d4f", "color": "white" }
                    }, "\u5220\u9664")
                  ])
                ]),
                project.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "project-content"
                }, [
                  createVNode("div", { class: "project-info" }, [
                    createVNode("h3", null, toDisplayString(project.value.projectName), 1),
                    createVNode("p", null, "\u8D1F\u8D23\u4EBA: " + toDisplayString(project.value.projectLeader), 1),
                    createVNode("p", null, "\u5BA2\u6237: " + toDisplayString(project.value.clientName), 1),
                    createVNode("p", null, "\u9879\u76EE\u7C7B\u578B: " + toDisplayString(project.value.projectType), 1),
                    createVNode("p", null, "\u670D\u52A1\u65E5\u671F: " + toDisplayString(formatDate(project.value.serviceStartDate)) + " - " + toDisplayString(formatDate(project.value.serviceEndDate)), 1),
                    createVNode("p", null, "\u670D\u52A1\u91D1\u989D: \xA5" + toDisplayString(project.value.serviceAmount.toFixed(2)), 1),
                    createVNode("p", null, [
                      createTextVNode("\u72B6\u6001: "),
                      createVNode("span", {
                        class: getStatusClass(project.value.status)
                      }, toDisplayString(getStatusText(project.value.status)), 3)
                    ]),
                    createVNode("p", null, "\u521B\u5EFA\u65F6\u95F4: " + toDisplayString(formatDateTime(project.value.createdAt)), 1),
                    createVNode("p", null, "\u66F4\u65B0\u65F6\u95F4: " + toDisplayString(formatDateTime(project.value.updatedAt)), 1)
                  ]),
                  project.value.formData ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "project-form-data"
                  }, [
                    createVNode("h3", null, "\u9879\u76EE\u8868\u5355\u6570\u636E"),
                    createVNode("div", { class: "form-section" }, [
                      createVNode("h4", null, "\u57FA\u7840\u4FE1\u606F"),
                      createVNode("p", null, "\u9879\u76EE\u80CC\u666F: " + toDisplayString(project.value.formData.basicInfo.projectBackground), 1),
                      createVNode("p", null, "\u5BA2\u6237\u9700\u6C42: " + toDisplayString(project.value.formData.basicInfo.clientDemand), 1),
                      createVNode("p", null, "\u670D\u52A1\u5185\u5BB9: " + toDisplayString(project.value.formData.basicInfo.serviceContent), 1),
                      createVNode("p", null, "\u9879\u76EE\u6210\u5458: " + toDisplayString(project.value.formData.basicInfo.projectMembers.join(", ")), 1)
                    ]),
                    project.value.formData.serviceIncome && project.value.formData.serviceIncome.length > 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "form-section"
                    }, [
                      createVNode("h4", null, "\u670D\u52A1\u6536\u5165"),
                      createVNode("table", { class: "table" }, [
                        createVNode("thead", null, [
                          createVNode("tr", null, [
                            createVNode("th", null, "\u91C7\u8D2D\u5185\u5BB9"),
                            createVNode("th", null, "\u5FC5\u8981\u6027\u63CF\u8FF0"),
                            createVNode("th", null, "\u542B\u7A0E\u91D1\u989D"),
                            createVNode("th", null, "\u7A0E\u7387"),
                            createVNode("th", null, "\u4E0D\u542B\u7A0E\u91D1\u989D")
                          ])
                        ]),
                        createVNode("tbody", null, [
                          (openBlock(true), createBlock(Fragment, null, renderList(project.value.formData.serviceIncome, (item) => {
                            return openBlock(), createBlock("tr", {
                              key: item.id
                            }, [
                              createVNode("td", null, toDisplayString(item.purchaseContent), 1),
                              createVNode("td", null, toDisplayString(item.necessityDesc), 1),
                              createVNode("td", null, "\xA5" + toDisplayString(item.amount.toFixed(2)), 1),
                              createVNode("td", null, toDisplayString(item.taxRate) + "%", 1),
                              createVNode("td", null, "\xA5" + toDisplayString((item.amount / (1 + item.taxRate / 100)).toFixed(2)), 1)
                            ]);
                          }), 128))
                        ])
                      ])
                    ])) : createCommentVNode("", true),
                    project.value.formData.outsourcingCost && project.value.formData.outsourcingCost.length > 0 ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "form-section"
                    }, [
                      createVNode("h4", null, "\u5916\u91C7\u6210\u672C"),
                      createVNode("table", { class: "table" }, [
                        createVNode("thead", null, [
                          createVNode("tr", null, [
                            createVNode("th", null, "\u91C7\u8D2D\u5185\u5BB9"),
                            createVNode("th", null, "\u5355\u4EF7"),
                            createVNode("th", null, "\u6570\u91CF"),
                            createVNode("th", null, "\u603B\u4EF7")
                          ])
                        ]),
                        createVNode("tbody", null, [
                          (openBlock(true), createBlock(Fragment, null, renderList(project.value.formData.outsourcingCost, (item) => {
                            return openBlock(), createBlock("tr", {
                              key: item.id
                            }, [
                              createVNode("td", null, toDisplayString(item.content), 1),
                              createVNode("td", null, "\xA5" + toDisplayString(item.unitPrice.toFixed(2)), 1),
                              createVNode("td", null, toDisplayString(item.quantity), 1),
                              createVNode("td", null, "\xA5" + toDisplayString((item.unitPrice * item.quantity).toFixed(2)), 1)
                            ]);
                          }), 128))
                        ])
                      ])
                    ])) : createCommentVNode("", true),
                    project.value.formData.laborCost && project.value.formData.laborCost.length > 0 ? (openBlock(), createBlock("div", {
                      key: 2,
                      class: "form-section"
                    }, [
                      createVNode("h4", null, "\u4EBA\u5DE5\u6210\u672C"),
                      createVNode("table", { class: "table" }, [
                        createVNode("thead", null, [
                          createVNode("tr", null, [
                            createVNode("th", null, "\u5458\u5DE5\u59D3\u540D"),
                            createVNode("th", null, "\u5458\u5DE5\u7EA7\u522B"),
                            createVNode("th", null, "\u65E5\u6210\u672C"),
                            createVNode("th", null, "\u6295\u5165\u5929\u6570"),
                            createVNode("th", null, "\u603B\u6210\u672C")
                          ])
                        ]),
                        createVNode("tbody", null, [
                          (openBlock(true), createBlock(Fragment, null, renderList(project.value.formData.laborCost, (item) => {
                            return openBlock(), createBlock("tr", {
                              key: item.id
                            }, [
                              createVNode("td", null, toDisplayString(item.employeeName), 1),
                              createVNode("td", null, toDisplayString(item.level), 1),
                              createVNode("td", null, "\xA5" + toDisplayString(item.dailyCost.toFixed(2)), 1),
                              createVNode("td", null, toDisplayString(item.days), 1),
                              createVNode("td", null, "\xA5" + toDisplayString((item.dailyCost * item.days).toFixed(2)), 1)
                            ]);
                          }), 128))
                        ])
                      ])
                    ])) : createCommentVNode("", true),
                    project.value.formData.otherExpenses && project.value.formData.otherExpenses.length > 0 ? (openBlock(), createBlock("div", {
                      key: 3,
                      class: "form-section"
                    }, [
                      createVNode("h4", null, "\u5176\u4ED6\u8D39\u7528"),
                      createVNode("table", { class: "table" }, [
                        createVNode("thead", null, [
                          createVNode("tr", null, [
                            createVNode("th", null, "\u8D39\u7528\u7C7B\u578B"),
                            createVNode("th", null, "\u91D1\u989D")
                          ])
                        ]),
                        createVNode("tbody", null, [
                          (openBlock(true), createBlock(Fragment, null, renderList(project.value.formData.otherExpenses, (item) => {
                            return openBlock(), createBlock("tr", {
                              key: item.id
                            }, [
                              createVNode("td", null, toDisplayString(item.category), 1),
                              createVNode("td", null, "\xA5" + toDisplayString(item.amount.toFixed(2)), 1)
                            ]);
                          }), 128))
                        ])
                      ])
                    ])) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "project-records" }, [
                    createVNode("h3", null, "\u8BB0\u8D26\u8BB0\u5F55"),
                    createVNode("div", { class: "record-filters" }, [
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => recordType.value = $event,
                        class: "record-type-select"
                      }, [
                        createVNode("option", { value: "" }, "\u6240\u6709\u7C7B\u578B"),
                        createVNode("option", { value: "income" }, "\u6536\u5165"),
                        createVNode("option", { value: "expense" }, "\u652F\u51FA")
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, recordType.value]
                      ]),
                      createVNode(_component_NuxtLink, {
                        to: "/accounting/new",
                        class: "btn btn-primary"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("\u65B0\u589E\u8BB0\u8D26")
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("table", { class: "table" }, [
                      createVNode("thead", null, [
                        createVNode("tr", null, [
                          createVNode("th", null, "\u8BB0\u5F55\u7C7B\u578B"),
                          createVNode("th", null, "\u5BA1\u6279\u6D41\u7A0B\u5355ID"),
                          createVNode("th", null, "\u8BB0\u8D26\u65E5\u671F"),
                          createVNode("th", null, "\u91D1\u989D"),
                          createVNode("th", null, "\u8D39\u7528\u7C7B\u522B"),
                          createVNode("th", null, "\u7528\u9014\u8BF4\u660E"),
                          createVNode("th", null, "\u7533\u8BF7\u4EBA"),
                          createVNode("th", null, "\u53D1\u7968\u53F7"),
                          createVNode("th", null, "\u4ED8\u6B3E\u65B9"),
                          createVNode("th", null, "\u5907\u6CE8"),
                          createVNode("th", null, "\u64CD\u4F5C")
                        ])
                      ]),
                      createVNode("tbody", null, [
                        (openBlock(true), createBlock(Fragment, null, renderList(filteredRecords.value, (record) => {
                          return openBlock(), createBlock("tr", {
                            key: record.id
                          }, [
                            createVNode("td", null, toDisplayString(record.recordType === "income" ? "\u6536\u5165" : "\u652F\u51FA"), 1),
                            createVNode("td", null, toDisplayString(record.approvalId), 1),
                            createVNode("td", null, toDisplayString(formatDate(record.recordDate)), 1),
                            createVNode("td", null, "\xA5" + toDisplayString(record.amount.toFixed(2)), 1),
                            createVNode("td", null, toDisplayString(record.categoryName), 1),
                            createVNode("td", null, toDisplayString(record.description), 1),
                            createVNode("td", null, toDisplayString(record.applicant), 1),
                            createVNode("td", null, toDisplayString(record.invoiceNo), 1),
                            createVNode("td", null, toDisplayString(record.payer), 1),
                            createVNode("td", null, toDisplayString(record.remark), 1),
                            createVNode("td", null, [
                              createVNode(_component_NuxtLink, {
                                to: `/accounting/${record.id}/edit`,
                                class: "btn btn-secondary"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("\u7F16\u8F91")
                                ]),
                                _: 1
                              }, 8, ["to"]),
                              createVNode("button", {
                                onClick: ($event) => deleteRecord(record.id),
                                class: "btn btn-secondary"
                              }, "\u5220\u9664", 8, ["onClick"])
                            ])
                          ]);
                        }), 128))
                      ])
                    ])
                  ])
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "loading"
                }, " \u52A0\u8F7D\u4E2D... "))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/projects/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8dd3447a"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-B9J4dkG0.mjs.map
