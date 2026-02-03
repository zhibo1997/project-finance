import { _ as __nuxt_component_0 } from './nuxt-link-Br-Hzc18.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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
  __name: "new",
  __ssrInlineRender: true,
  setup(__props) {
    const formData = ref({
      basicInfo: {
        projectName: "",
        projectLeader: "",
        clientName: "",
        projectType: "",
        serviceStartDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        serviceEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
        projectMembers: [],
        projectBackground: "",
        clientDemand: "",
        serviceContent: ""
      },
      serviceIncome: [],
      outsourcingCost: [],
      laborCost: [],
      otherExpenses: []
    });
    const projectMembersText = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "project-form-page" }, _attrs))} data-v-5d2fd2d8><div class="page-header" data-v-5d2fd2d8><h2 data-v-5d2fd2d8>\u65B0\u5EFA\u9879\u76EE</h2></div><form class="project-form" data-v-5d2fd2d8><div class="form-section" data-v-5d2fd2d8><h3 data-v-5d2fd2d8>\u9879\u76EE\u57FA\u672C\u4FE1\u606F</h3><div class="form-group" data-v-5d2fd2d8><label for="projectName" data-v-5d2fd2d8>\u9879\u76EE\u540D\u79F0 *</label><input id="projectName"${ssrRenderAttr("value", formData.value.basicInfo.projectName)} type="text" required placeholder="\u8BF7\u8F93\u5165\u9879\u76EE\u540D\u79F0" data-v-5d2fd2d8></div><div class="form-group" data-v-5d2fd2d8><label for="projectLeader" data-v-5d2fd2d8>\u9879\u76EE\u8D1F\u8D23\u4EBA *</label><input id="projectLeader"${ssrRenderAttr("value", formData.value.basicInfo.projectLeader)} type="text" required placeholder="\u8BF7\u8F93\u5165\u9879\u76EE\u8D1F\u8D23\u4EBA" data-v-5d2fd2d8></div><div class="form-group" data-v-5d2fd2d8><label for="clientName" data-v-5d2fd2d8>\u5BA2\u6237\u540D\u79F0 *</label><input id="clientName"${ssrRenderAttr("value", formData.value.basicInfo.clientName)} type="text" required placeholder="\u8BF7\u8F93\u5165\u5BA2\u6237\u540D\u79F0" data-v-5d2fd2d8></div><div class="form-group" data-v-5d2fd2d8><label for="projectType" data-v-5d2fd2d8>\u9879\u76EE\u7C7B\u578B *</label><input id="projectType"${ssrRenderAttr("value", formData.value.basicInfo.projectType)} type="text" required placeholder="\u8BF7\u8F93\u5165\u9879\u76EE\u7C7B\u578B" data-v-5d2fd2d8></div><div class="form-group" data-v-5d2fd2d8><label for="serviceStartDate" data-v-5d2fd2d8>\u670D\u52A1\u5F00\u59CB\u65E5\u671F *</label><input id="serviceStartDate"${ssrRenderAttr("value", formData.value.basicInfo.serviceStartDate)} type="date" required data-v-5d2fd2d8></div><div class="form-group" data-v-5d2fd2d8><label for="serviceEndDate" data-v-5d2fd2d8>\u670D\u52A1\u7ED3\u675F\u65E5\u671F *</label><input id="serviceEndDate"${ssrRenderAttr("value", formData.value.basicInfo.serviceEndDate)} type="date" required data-v-5d2fd2d8></div><div class="form-group" data-v-5d2fd2d8><label for="projectMembers" data-v-5d2fd2d8>\u9879\u76EE\u6210\u5458</label><input id="projectMembers"${ssrRenderAttr("value", projectMembersText.value)} type="text" placeholder="\u8BF7\u8F93\u5165\u9879\u76EE\u6210\u5458\uFF0C\u7528\u9017\u53F7\u5206\u9694" data-v-5d2fd2d8></div><div class="form-group" data-v-5d2fd2d8><label for="projectBackground" data-v-5d2fd2d8>\u9879\u76EE\u80CC\u666F</label><textarea id="projectBackground" placeholder="\u8BF7\u8F93\u5165\u9879\u76EE\u80CC\u666F" data-v-5d2fd2d8>${ssrInterpolate(formData.value.basicInfo.projectBackground)}</textarea></div><div class="form-group" data-v-5d2fd2d8><label for="clientDemand" data-v-5d2fd2d8>\u5BA2\u6237\u9700\u6C42</label><textarea id="clientDemand" placeholder="\u8BF7\u8F93\u5165\u5BA2\u6237\u9700\u6C42" data-v-5d2fd2d8>${ssrInterpolate(formData.value.basicInfo.clientDemand)}</textarea></div><div class="form-group" data-v-5d2fd2d8><label for="serviceContent" data-v-5d2fd2d8>\u670D\u52A1\u5185\u5BB9</label><textarea id="serviceContent" placeholder="\u8BF7\u8F93\u5165\u670D\u52A1\u5185\u5BB9" data-v-5d2fd2d8>${ssrInterpolate(formData.value.basicInfo.serviceContent)}</textarea></div></div><div class="form-section" data-v-5d2fd2d8><h3 data-v-5d2fd2d8>\u670D\u52A1\u6536\u5165</h3><button type="button" class="btn btn-secondary" data-v-5d2fd2d8> \u65B0\u589E\u6536\u5165\u9879 </button><!--[-->`);
      ssrRenderList(formData.value.serviceIncome, (item, index) => {
        _push(`<div class="income-item" data-v-5d2fd2d8><div class="form-group" data-v-5d2fd2d8><label data-v-5d2fd2d8>\u91C7\u8D2D\u5185\u5BB9 *</label><input${ssrRenderAttr("value", item.purchaseContent)} type="text" required placeholder="\u8BF7\u8F93\u5165\u91C7\u8D2D\u5185\u5BB9" data-v-5d2fd2d8></div><div class="form-group" data-v-5d2fd2d8><label data-v-5d2fd2d8>\u5FC5\u8981\u6027\u63CF\u8FF0 *</label><textarea required placeholder="\u8BF7\u8F93\u5165\u5FC5\u8981\u6027\u63CF\u8FF0" data-v-5d2fd2d8>${ssrInterpolate(item.necessityDesc)}</textarea></div><div class="form-group" data-v-5d2fd2d8><label data-v-5d2fd2d8>\u542B\u7A0E\u91D1\u989D *</label><input${ssrRenderAttr("value", item.amount)} type="number" required placeholder="\u8BF7\u8F93\u5165\u542B\u7A0E\u91D1\u989D" data-v-5d2fd2d8></div><div class="form-group" data-v-5d2fd2d8><label data-v-5d2fd2d8>\u7A0E\u7387 *</label><input${ssrRenderAttr("value", item.taxRate)} type="number" required placeholder="\u8BF7\u8F93\u5165\u7A0E\u7387" data-v-5d2fd2d8></div><button type="button" class="btn btn-secondary" data-v-5d2fd2d8> \u5220\u9664 </button></div>`);
      });
      _push(`<!--]--></div><div class="form-section" data-v-5d2fd2d8><h3 data-v-5d2fd2d8>\u5916\u91C7\u6210\u672C</h3><button type="button" class="btn btn-secondary" data-v-5d2fd2d8> \u65B0\u589E\u5916\u91C7\u6210\u672C\u9879 </button><!--[-->`);
      ssrRenderList(formData.value.outsourcingCost, (item, index) => {
        _push(`<div class="cost-item" data-v-5d2fd2d8><div class="form-group" data-v-5d2fd2d8><label data-v-5d2fd2d8>\u91C7\u8D2D\u5185\u5BB9 *</label><input${ssrRenderAttr("value", item.content)} type="text" required placeholder="\u8BF7\u8F93\u5165\u91C7\u8D2D\u5185\u5BB9" data-v-5d2fd2d8></div><div class="form-group" data-v-5d2fd2d8><label data-v-5d2fd2d8>\u5355\u4EF7 *</label><input${ssrRenderAttr("value", item.unitPrice)} type="number" required placeholder="\u8BF7\u8F93\u5165\u5355\u4EF7" data-v-5d2fd2d8></div><div class="form-group" data-v-5d2fd2d8><label data-v-5d2fd2d8>\u6570\u91CF *</label><input${ssrRenderAttr("value", item.quantity)} type="number" required placeholder="\u8BF7\u8F93\u5165\u6570\u91CF" data-v-5d2fd2d8></div><button type="button" class="btn btn-secondary" data-v-5d2fd2d8> \u5220\u9664 </button></div>`);
      });
      _push(`<!--]--></div><div class="form-section" data-v-5d2fd2d8><h3 data-v-5d2fd2d8>\u4EBA\u5DE5\u6210\u672C</h3><button type="button" class="btn btn-secondary" data-v-5d2fd2d8> \u65B0\u589E\u4EBA\u5DE5\u6210\u672C\u9879 </button><!--[-->`);
      ssrRenderList(formData.value.laborCost, (item, index) => {
        _push(`<div class="labor-item" data-v-5d2fd2d8><div class="form-group" data-v-5d2fd2d8><label data-v-5d2fd2d8>\u5458\u5DE5\u59D3\u540D *</label><input${ssrRenderAttr("value", item.employeeName)} type="text" required placeholder="\u8BF7\u8F93\u5165\u5458\u5DE5\u59D3\u540D" data-v-5d2fd2d8></div><div class="form-group" data-v-5d2fd2d8><label data-v-5d2fd2d8>\u5458\u5DE5\u7EA7\u522B *</label><input${ssrRenderAttr("value", item.level)} type="text" required placeholder="\u8BF7\u8F93\u5165\u5458\u5DE5\u7EA7\u522B" data-v-5d2fd2d8></div><div class="form-group" data-v-5d2fd2d8><label data-v-5d2fd2d8>\u65E5\u6210\u672C *</label><input${ssrRenderAttr("value", item.dailyCost)} type="number" required placeholder="\u8BF7\u8F93\u5165\u65E5\u6210\u672C" data-v-5d2fd2d8></div><div class="form-group" data-v-5d2fd2d8><label data-v-5d2fd2d8>\u6295\u5165\u5929\u6570 *</label><input${ssrRenderAttr("value", item.days)} type="number" required placeholder="\u8BF7\u8F93\u5165\u6295\u5165\u5929\u6570" data-v-5d2fd2d8></div><button type="button" class="btn btn-secondary" data-v-5d2fd2d8> \u5220\u9664 </button></div>`);
      });
      _push(`<!--]--></div><div class="form-section" data-v-5d2fd2d8><h3 data-v-5d2fd2d8>\u5176\u4ED6\u8D39\u7528</h3><button type="button" class="btn btn-secondary" data-v-5d2fd2d8> \u65B0\u589E\u5176\u4ED6\u8D39\u7528\u9879 </button><!--[-->`);
      ssrRenderList(formData.value.otherExpenses, (item, index) => {
        _push(`<div class="expense-item" data-v-5d2fd2d8><div class="form-group" data-v-5d2fd2d8><label data-v-5d2fd2d8>\u8D39\u7528\u7C7B\u578B *</label><input${ssrRenderAttr("value", item.category)} type="text" required placeholder="\u8BF7\u8F93\u5165\u8D39\u7528\u7C7B\u578B" data-v-5d2fd2d8></div><div class="form-group" data-v-5d2fd2d8><label data-v-5d2fd2d8>\u91D1\u989D *</label><input${ssrRenderAttr("value", item.amount)} type="number" required placeholder="\u8BF7\u8F93\u5165\u91D1\u989D" data-v-5d2fd2d8></div><button type="button" class="btn btn-secondary" data-v-5d2fd2d8> \u5220\u9664 </button></div>`);
      });
      _push(`<!--]--></div><div class="form-actions" data-v-5d2fd2d8>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/projects",
        class: "btn btn-secondary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u53D6\u6D88`);
          } else {
            return [
              createTextVNode("\u53D6\u6D88")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="submit" class="btn btn-primary" data-v-5d2fd2d8>\u4FDD\u5B58</button></div></form></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/projects/new.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _new = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5d2fd2d8"]]);

export { _new as default };
//# sourceMappingURL=new-BCN_TRHs.mjs.map
