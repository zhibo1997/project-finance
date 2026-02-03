import { _ as __nuxt_component_0 } from './Layout-Bn7f3IU0.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-Br-Hzc18.mjs';
import { defineComponent, ref, withCtx, createTextVNode, createVNode, toDisplayString, withModifiers, withDirectives, vModelText, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
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
  __name: "edit",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const id = route.params.id;
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
    const generateId = () => {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };
    const addServiceIncomeItem = () => {
      const item = {
        id: generateId(),
        purchaseContent: "",
        necessityDesc: "",
        amount: 0,
        taxRate: 0
      };
      formData.value.serviceIncome.push(item);
    };
    const removeServiceIncomeItem = (index) => {
      formData.value.serviceIncome.splice(index, 1);
    };
    const addOutsourcingCostItem = () => {
      const item = {
        id: generateId(),
        content: "",
        unitPrice: 0,
        quantity: 0
      };
      formData.value.outsourcingCost.push(item);
    };
    const removeOutsourcingCostItem = (index) => {
      formData.value.outsourcingCost.splice(index, 1);
    };
    const addLaborCostItem = () => {
      const item = {
        id: generateId(),
        employeeId: "",
        employeeName: "",
        level: "",
        dailyCost: 0,
        days: 0
      };
      formData.value.laborCost.push(item);
    };
    const removeLaborCostItem = (index) => {
      formData.value.laborCost.splice(index, 1);
    };
    const addOtherExpenseItem = () => {
      const item = {
        id: generateId(),
        category: "",
        amount: 0
      };
      formData.value.otherExpenses.push(item);
    };
    const removeOtherExpenseItem = (index) => {
      formData.value.otherExpenses.splice(index, 1);
    };
    const submitForm = async () => {
      try {
        formData.value.basicInfo.projectMembers = projectMembersText.value.split(",").map((member) => member.trim()).filter((member) => member.length > 0);
        let totalAmount = 0;
        formData.value.serviceIncome.forEach((item) => {
          totalAmount += item.amount;
        });
        if (id) {
          const response = await $fetch(`/api/projects/${id}`, {
            method: "PUT",
            body: {
              ...formData.value.basicInfo,
              serviceAmount: totalAmount,
              formData: formData.value
            }
          });
          if ((response == null ? void 0 : response.code) === 0) {
            alert("\u9879\u76EE\u66F4\u65B0\u6210\u529F");
            navigateTo(`/projects/${id}`);
          } else {
            alert((response == null ? void 0 : response.message) || "\u66F4\u65B0\u9879\u76EE\u5931\u8D25");
          }
        } else {
          const response = await $fetch("/api/projects", {
            method: "POST",
            body: {
              ...formData.value.basicInfo,
              serviceAmount: totalAmount,
              formData: formData.value
            }
          });
          if ((response == null ? void 0 : response.code) === 0) {
            alert("\u9879\u76EE\u521B\u5EFA\u6210\u529F");
            navigateTo(`/projects/${response.data.id}`);
          } else {
            alert((response == null ? void 0 : response.message) || "\u521B\u5EFA\u9879\u76EE\u5931\u8D25");
          }
        }
      } catch (error2) {
        console.error("\u4FDD\u5B58\u9879\u76EE\u5931\u8D25:", error2);
        alert("\u4FDD\u5B58\u9879\u76EE\u5931\u8D25");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Layout = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_Layout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="project-form-page" data-v-1e8ba435${_scopeId}><div class="page-header" data-v-1e8ba435${_scopeId}><h2 data-v-1e8ba435${_scopeId}>${ssrInterpolate(_ctx.project ? "\u7F16\u8F91\u9879\u76EE" : "\u65B0\u5EFA\u9879\u76EE")}</h2></div><form class="project-form" data-v-1e8ba435${_scopeId}><div class="form-section" data-v-1e8ba435${_scopeId}><h3 data-v-1e8ba435${_scopeId}>\u9879\u76EE\u57FA\u672C\u4FE1\u606F</h3><div class="form-group" data-v-1e8ba435${_scopeId}><label for="projectName" data-v-1e8ba435${_scopeId}>\u9879\u76EE\u540D\u79F0 *</label><input id="projectName"${ssrRenderAttr("value", formData.value.basicInfo.projectName)} type="text" required placeholder="\u8BF7\u8F93\u5165\u9879\u76EE\u540D\u79F0" data-v-1e8ba435${_scopeId}></div><div class="form-group" data-v-1e8ba435${_scopeId}><label for="projectLeader" data-v-1e8ba435${_scopeId}>\u9879\u76EE\u8D1F\u8D23\u4EBA *</label><input id="projectLeader"${ssrRenderAttr("value", formData.value.basicInfo.projectLeader)} type="text" required placeholder="\u8BF7\u8F93\u5165\u9879\u76EE\u8D1F\u8D23\u4EBA" data-v-1e8ba435${_scopeId}></div><div class="form-group" data-v-1e8ba435${_scopeId}><label for="clientName" data-v-1e8ba435${_scopeId}>\u5BA2\u6237\u540D\u79F0 *</label><input id="clientName"${ssrRenderAttr("value", formData.value.basicInfo.clientName)} type="text" required placeholder="\u8BF7\u8F93\u5165\u5BA2\u6237\u540D\u79F0" data-v-1e8ba435${_scopeId}></div><div class="form-group" data-v-1e8ba435${_scopeId}><label for="projectType" data-v-1e8ba435${_scopeId}>\u9879\u76EE\u7C7B\u578B *</label><input id="projectType"${ssrRenderAttr("value", formData.value.basicInfo.projectType)} type="text" required placeholder="\u8BF7\u8F93\u5165\u9879\u76EE\u7C7B\u578B" data-v-1e8ba435${_scopeId}></div><div class="form-group" data-v-1e8ba435${_scopeId}><label for="serviceStartDate" data-v-1e8ba435${_scopeId}>\u670D\u52A1\u5F00\u59CB\u65E5\u671F *</label><input id="serviceStartDate"${ssrRenderAttr("value", formData.value.basicInfo.serviceStartDate)} type="date" required data-v-1e8ba435${_scopeId}></div><div class="form-group" data-v-1e8ba435${_scopeId}><label for="serviceEndDate" data-v-1e8ba435${_scopeId}>\u670D\u52A1\u7ED3\u675F\u65E5\u671F *</label><input id="serviceEndDate"${ssrRenderAttr("value", formData.value.basicInfo.serviceEndDate)} type="date" required data-v-1e8ba435${_scopeId}></div><div class="form-group" data-v-1e8ba435${_scopeId}><label for="projectMembers" data-v-1e8ba435${_scopeId}>\u9879\u76EE\u6210\u5458</label><input id="projectMembers"${ssrRenderAttr("value", projectMembersText.value)} type="text" placeholder="\u8BF7\u8F93\u5165\u9879\u76EE\u6210\u5458\uFF0C\u7528\u9017\u53F7\u5206\u9694" data-v-1e8ba435${_scopeId}></div><div class="form-group" data-v-1e8ba435${_scopeId}><label for="projectBackground" data-v-1e8ba435${_scopeId}>\u9879\u76EE\u80CC\u666F</label><textarea id="projectBackground" placeholder="\u8BF7\u8F93\u5165\u9879\u76EE\u80CC\u666F" data-v-1e8ba435${_scopeId}>${ssrInterpolate(formData.value.basicInfo.projectBackground)}</textarea></div><div class="form-group" data-v-1e8ba435${_scopeId}><label for="clientDemand" data-v-1e8ba435${_scopeId}>\u5BA2\u6237\u9700\u6C42</label><textarea id="clientDemand" placeholder="\u8BF7\u8F93\u5165\u5BA2\u6237\u9700\u6C42" data-v-1e8ba435${_scopeId}>${ssrInterpolate(formData.value.basicInfo.clientDemand)}</textarea></div><div class="form-group" data-v-1e8ba435${_scopeId}><label for="serviceContent" data-v-1e8ba435${_scopeId}>\u670D\u52A1\u5185\u5BB9</label><textarea id="serviceContent" placeholder="\u8BF7\u8F93\u5165\u670D\u52A1\u5185\u5BB9" data-v-1e8ba435${_scopeId}>${ssrInterpolate(formData.value.basicInfo.serviceContent)}</textarea></div></div><div class="form-section" data-v-1e8ba435${_scopeId}><h3 data-v-1e8ba435${_scopeId}>\u670D\u52A1\u6536\u5165</h3><button type="button" class="btn btn-secondary" data-v-1e8ba435${_scopeId}> \u65B0\u589E\u6536\u5165\u9879 </button><!--[-->`);
            ssrRenderList(formData.value.serviceIncome, (item, index) => {
              _push2(`<div class="income-item" data-v-1e8ba435${_scopeId}><div class="form-group" data-v-1e8ba435${_scopeId}><label data-v-1e8ba435${_scopeId}>\u91C7\u8D2D\u5185\u5BB9 *</label><input${ssrRenderAttr("value", item.purchaseContent)} type="text" required placeholder="\u8BF7\u8F93\u5165\u91C7\u8D2D\u5185\u5BB9" data-v-1e8ba435${_scopeId}></div><div class="form-group" data-v-1e8ba435${_scopeId}><label data-v-1e8ba435${_scopeId}>\u5FC5\u8981\u6027\u63CF\u8FF0 *</label><textarea required placeholder="\u8BF7\u8F93\u5165\u5FC5\u8981\u6027\u63CF\u8FF0" data-v-1e8ba435${_scopeId}>${ssrInterpolate(item.necessityDesc)}</textarea></div><div class="form-group" data-v-1e8ba435${_scopeId}><label data-v-1e8ba435${_scopeId}>\u542B\u7A0E\u91D1\u989D *</label><input${ssrRenderAttr("value", item.amount)} type="number" required placeholder="\u8BF7\u8F93\u5165\u542B\u7A0E\u91D1\u989D" data-v-1e8ba435${_scopeId}></div><div class="form-group" data-v-1e8ba435${_scopeId}><label data-v-1e8ba435${_scopeId}>\u7A0E\u7387 *</label><input${ssrRenderAttr("value", item.taxRate)} type="number" required placeholder="\u8BF7\u8F93\u5165\u7A0E\u7387" data-v-1e8ba435${_scopeId}></div><button type="button" class="btn btn-secondary" data-v-1e8ba435${_scopeId}> \u5220\u9664 </button></div>`);
            });
            _push2(`<!--]--></div><div class="form-section" data-v-1e8ba435${_scopeId}><h3 data-v-1e8ba435${_scopeId}>\u5916\u91C7\u6210\u672C</h3><button type="button" class="btn btn-secondary" data-v-1e8ba435${_scopeId}> \u65B0\u589E\u5916\u91C7\u6210\u672C\u9879 </button><!--[-->`);
            ssrRenderList(formData.value.outsourcingCost, (item, index) => {
              _push2(`<div class="cost-item" data-v-1e8ba435${_scopeId}><div class="form-group" data-v-1e8ba435${_scopeId}><label data-v-1e8ba435${_scopeId}>\u91C7\u8D2D\u5185\u5BB9 *</label><input${ssrRenderAttr("value", item.content)} type="text" required placeholder="\u8BF7\u8F93\u5165\u91C7\u8D2D\u5185\u5BB9" data-v-1e8ba435${_scopeId}></div><div class="form-group" data-v-1e8ba435${_scopeId}><label data-v-1e8ba435${_scopeId}>\u5355\u4EF7 *</label><input${ssrRenderAttr("value", item.unitPrice)} type="number" required placeholder="\u8BF7\u8F93\u5165\u5355\u4EF7" data-v-1e8ba435${_scopeId}></div><div class="form-group" data-v-1e8ba435${_scopeId}><label data-v-1e8ba435${_scopeId}>\u6570\u91CF *</label><input${ssrRenderAttr("value", item.quantity)} type="number" required placeholder="\u8BF7\u8F93\u5165\u6570\u91CF" data-v-1e8ba435${_scopeId}></div><button type="button" class="btn btn-secondary" data-v-1e8ba435${_scopeId}> \u5220\u9664 </button></div>`);
            });
            _push2(`<!--]--></div><div class="form-section" data-v-1e8ba435${_scopeId}><h3 data-v-1e8ba435${_scopeId}>\u4EBA\u5DE5\u6210\u672C</h3><button type="button" class="btn btn-secondary" data-v-1e8ba435${_scopeId}> \u65B0\u589E\u4EBA\u5DE5\u6210\u672C\u9879 </button><!--[-->`);
            ssrRenderList(formData.value.laborCost, (item, index) => {
              _push2(`<div class="labor-item" data-v-1e8ba435${_scopeId}><div class="form-group" data-v-1e8ba435${_scopeId}><label data-v-1e8ba435${_scopeId}>\u5458\u5DE5\u59D3\u540D *</label><input${ssrRenderAttr("value", item.employeeName)} type="text" required placeholder="\u8BF7\u8F93\u5165\u5458\u5DE5\u59D3\u540D" data-v-1e8ba435${_scopeId}></div><div class="form-group" data-v-1e8ba435${_scopeId}><label data-v-1e8ba435${_scopeId}>\u5458\u5DE5\u7EA7\u522B *</label><input${ssrRenderAttr("value", item.level)} type="text" required placeholder="\u8BF7\u8F93\u5165\u5458\u5DE5\u7EA7\u522B" data-v-1e8ba435${_scopeId}></div><div class="form-group" data-v-1e8ba435${_scopeId}><label data-v-1e8ba435${_scopeId}>\u65E5\u6210\u672C *</label><input${ssrRenderAttr("value", item.dailyCost)} type="number" required placeholder="\u8BF7\u8F93\u5165\u65E5\u6210\u672C" data-v-1e8ba435${_scopeId}></div><div class="form-group" data-v-1e8ba435${_scopeId}><label data-v-1e8ba435${_scopeId}>\u6295\u5165\u5929\u6570 *</label><input${ssrRenderAttr("value", item.days)} type="number" required placeholder="\u8BF7\u8F93\u5165\u6295\u5165\u5929\u6570" data-v-1e8ba435${_scopeId}></div><button type="button" class="btn btn-secondary" data-v-1e8ba435${_scopeId}> \u5220\u9664 </button></div>`);
            });
            _push2(`<!--]--></div><div class="form-section" data-v-1e8ba435${_scopeId}><h3 data-v-1e8ba435${_scopeId}>\u5176\u4ED6\u8D39\u7528</h3><button type="button" class="btn btn-secondary" data-v-1e8ba435${_scopeId}> \u65B0\u589E\u5176\u4ED6\u8D39\u7528\u9879 </button><!--[-->`);
            ssrRenderList(formData.value.otherExpenses, (item, index) => {
              _push2(`<div class="expense-item" data-v-1e8ba435${_scopeId}><div class="form-group" data-v-1e8ba435${_scopeId}><label data-v-1e8ba435${_scopeId}>\u8D39\u7528\u7C7B\u578B *</label><input${ssrRenderAttr("value", item.category)} type="text" required placeholder="\u8BF7\u8F93\u5165\u8D39\u7528\u7C7B\u578B" data-v-1e8ba435${_scopeId}></div><div class="form-group" data-v-1e8ba435${_scopeId}><label data-v-1e8ba435${_scopeId}>\u91D1\u989D *</label><input${ssrRenderAttr("value", item.amount)} type="number" required placeholder="\u8BF7\u8F93\u5165\u91D1\u989D" data-v-1e8ba435${_scopeId}></div><button type="button" class="btn btn-secondary" data-v-1e8ba435${_scopeId}> \u5220\u9664 </button></div>`);
            });
            _push2(`<!--]--></div><div class="form-actions" data-v-1e8ba435${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/projects",
              class: "btn btn-secondary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u53D6\u6D88`);
                } else {
                  return [
                    createTextVNode("\u53D6\u6D88")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<button type="submit" class="btn btn-primary" data-v-1e8ba435${_scopeId}>\u4FDD\u5B58</button></div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "project-form-page" }, [
                createVNode("div", { class: "page-header" }, [
                  createVNode("h2", null, toDisplayString(_ctx.project ? "\u7F16\u8F91\u9879\u76EE" : "\u65B0\u5EFA\u9879\u76EE"), 1)
                ]),
                createVNode("form", {
                  onSubmit: withModifiers(submitForm, ["prevent"]),
                  class: "project-form"
                }, [
                  createVNode("div", { class: "form-section" }, [
                    createVNode("h3", null, "\u9879\u76EE\u57FA\u672C\u4FE1\u606F"),
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { for: "projectName" }, "\u9879\u76EE\u540D\u79F0 *"),
                      withDirectives(createVNode("input", {
                        id: "projectName",
                        "onUpdate:modelValue": ($event) => formData.value.basicInfo.projectName = $event,
                        type: "text",
                        required: "",
                        placeholder: "\u8BF7\u8F93\u5165\u9879\u76EE\u540D\u79F0"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, formData.value.basicInfo.projectName]
                      ])
                    ]),
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { for: "projectLeader" }, "\u9879\u76EE\u8D1F\u8D23\u4EBA *"),
                      withDirectives(createVNode("input", {
                        id: "projectLeader",
                        "onUpdate:modelValue": ($event) => formData.value.basicInfo.projectLeader = $event,
                        type: "text",
                        required: "",
                        placeholder: "\u8BF7\u8F93\u5165\u9879\u76EE\u8D1F\u8D23\u4EBA"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, formData.value.basicInfo.projectLeader]
                      ])
                    ]),
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { for: "clientName" }, "\u5BA2\u6237\u540D\u79F0 *"),
                      withDirectives(createVNode("input", {
                        id: "clientName",
                        "onUpdate:modelValue": ($event) => formData.value.basicInfo.clientName = $event,
                        type: "text",
                        required: "",
                        placeholder: "\u8BF7\u8F93\u5165\u5BA2\u6237\u540D\u79F0"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, formData.value.basicInfo.clientName]
                      ])
                    ]),
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { for: "projectType" }, "\u9879\u76EE\u7C7B\u578B *"),
                      withDirectives(createVNode("input", {
                        id: "projectType",
                        "onUpdate:modelValue": ($event) => formData.value.basicInfo.projectType = $event,
                        type: "text",
                        required: "",
                        placeholder: "\u8BF7\u8F93\u5165\u9879\u76EE\u7C7B\u578B"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, formData.value.basicInfo.projectType]
                      ])
                    ]),
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { for: "serviceStartDate" }, "\u670D\u52A1\u5F00\u59CB\u65E5\u671F *"),
                      withDirectives(createVNode("input", {
                        id: "serviceStartDate",
                        "onUpdate:modelValue": ($event) => formData.value.basicInfo.serviceStartDate = $event,
                        type: "date",
                        required: ""
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, formData.value.basicInfo.serviceStartDate]
                      ])
                    ]),
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { for: "serviceEndDate" }, "\u670D\u52A1\u7ED3\u675F\u65E5\u671F *"),
                      withDirectives(createVNode("input", {
                        id: "serviceEndDate",
                        "onUpdate:modelValue": ($event) => formData.value.basicInfo.serviceEndDate = $event,
                        type: "date",
                        required: ""
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, formData.value.basicInfo.serviceEndDate]
                      ])
                    ]),
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { for: "projectMembers" }, "\u9879\u76EE\u6210\u5458"),
                      withDirectives(createVNode("input", {
                        id: "projectMembers",
                        "onUpdate:modelValue": ($event) => projectMembersText.value = $event,
                        type: "text",
                        placeholder: "\u8BF7\u8F93\u5165\u9879\u76EE\u6210\u5458\uFF0C\u7528\u9017\u53F7\u5206\u9694"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, projectMembersText.value]
                      ])
                    ]),
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { for: "projectBackground" }, "\u9879\u76EE\u80CC\u666F"),
                      withDirectives(createVNode("textarea", {
                        id: "projectBackground",
                        "onUpdate:modelValue": ($event) => formData.value.basicInfo.projectBackground = $event,
                        placeholder: "\u8BF7\u8F93\u5165\u9879\u76EE\u80CC\u666F"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, formData.value.basicInfo.projectBackground]
                      ])
                    ]),
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { for: "clientDemand" }, "\u5BA2\u6237\u9700\u6C42"),
                      withDirectives(createVNode("textarea", {
                        id: "clientDemand",
                        "onUpdate:modelValue": ($event) => formData.value.basicInfo.clientDemand = $event,
                        placeholder: "\u8BF7\u8F93\u5165\u5BA2\u6237\u9700\u6C42"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, formData.value.basicInfo.clientDemand]
                      ])
                    ]),
                    createVNode("div", { class: "form-group" }, [
                      createVNode("label", { for: "serviceContent" }, "\u670D\u52A1\u5185\u5BB9"),
                      withDirectives(createVNode("textarea", {
                        id: "serviceContent",
                        "onUpdate:modelValue": ($event) => formData.value.basicInfo.serviceContent = $event,
                        placeholder: "\u8BF7\u8F93\u5165\u670D\u52A1\u5185\u5BB9"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, formData.value.basicInfo.serviceContent]
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "form-section" }, [
                    createVNode("h3", null, "\u670D\u52A1\u6536\u5165"),
                    createVNode("button", {
                      type: "button",
                      onClick: addServiceIncomeItem,
                      class: "btn btn-secondary"
                    }, " \u65B0\u589E\u6536\u5165\u9879 "),
                    (openBlock(true), createBlock(Fragment, null, renderList(formData.value.serviceIncome, (item, index) => {
                      return openBlock(), createBlock("div", {
                        key: item.id,
                        class: "income-item"
                      }, [
                        createVNode("div", { class: "form-group" }, [
                          createVNode("label", null, "\u91C7\u8D2D\u5185\u5BB9 *"),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => item.purchaseContent = $event,
                            type: "text",
                            required: "",
                            placeholder: "\u8BF7\u8F93\u5165\u91C7\u8D2D\u5185\u5BB9"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, item.purchaseContent]
                          ])
                        ]),
                        createVNode("div", { class: "form-group" }, [
                          createVNode("label", null, "\u5FC5\u8981\u6027\u63CF\u8FF0 *"),
                          withDirectives(createVNode("textarea", {
                            "onUpdate:modelValue": ($event) => item.necessityDesc = $event,
                            required: "",
                            placeholder: "\u8BF7\u8F93\u5165\u5FC5\u8981\u6027\u63CF\u8FF0"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, item.necessityDesc]
                          ])
                        ]),
                        createVNode("div", { class: "form-group" }, [
                          createVNode("label", null, "\u542B\u7A0E\u91D1\u989D *"),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => item.amount = $event,
                            type: "number",
                            required: "",
                            placeholder: "\u8BF7\u8F93\u5165\u542B\u7A0E\u91D1\u989D"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [
                              vModelText,
                              item.amount,
                              void 0,
                              { number: true }
                            ]
                          ])
                        ]),
                        createVNode("div", { class: "form-group" }, [
                          createVNode("label", null, "\u7A0E\u7387 *"),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => item.taxRate = $event,
                            type: "number",
                            required: "",
                            placeholder: "\u8BF7\u8F93\u5165\u7A0E\u7387"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [
                              vModelText,
                              item.taxRate,
                              void 0,
                              { number: true }
                            ]
                          ])
                        ]),
                        createVNode("button", {
                          type: "button",
                          onClick: ($event) => removeServiceIncomeItem(index),
                          class: "btn btn-secondary"
                        }, " \u5220\u9664 ", 8, ["onClick"])
                      ]);
                    }), 128))
                  ]),
                  createVNode("div", { class: "form-section" }, [
                    createVNode("h3", null, "\u5916\u91C7\u6210\u672C"),
                    createVNode("button", {
                      type: "button",
                      onClick: addOutsourcingCostItem,
                      class: "btn btn-secondary"
                    }, " \u65B0\u589E\u5916\u91C7\u6210\u672C\u9879 "),
                    (openBlock(true), createBlock(Fragment, null, renderList(formData.value.outsourcingCost, (item, index) => {
                      return openBlock(), createBlock("div", {
                        key: item.id,
                        class: "cost-item"
                      }, [
                        createVNode("div", { class: "form-group" }, [
                          createVNode("label", null, "\u91C7\u8D2D\u5185\u5BB9 *"),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => item.content = $event,
                            type: "text",
                            required: "",
                            placeholder: "\u8BF7\u8F93\u5165\u91C7\u8D2D\u5185\u5BB9"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, item.content]
                          ])
                        ]),
                        createVNode("div", { class: "form-group" }, [
                          createVNode("label", null, "\u5355\u4EF7 *"),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => item.unitPrice = $event,
                            type: "number",
                            required: "",
                            placeholder: "\u8BF7\u8F93\u5165\u5355\u4EF7"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [
                              vModelText,
                              item.unitPrice,
                              void 0,
                              { number: true }
                            ]
                          ])
                        ]),
                        createVNode("div", { class: "form-group" }, [
                          createVNode("label", null, "\u6570\u91CF *"),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => item.quantity = $event,
                            type: "number",
                            required: "",
                            placeholder: "\u8BF7\u8F93\u5165\u6570\u91CF"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [
                              vModelText,
                              item.quantity,
                              void 0,
                              { number: true }
                            ]
                          ])
                        ]),
                        createVNode("button", {
                          type: "button",
                          onClick: ($event) => removeOutsourcingCostItem(index),
                          class: "btn btn-secondary"
                        }, " \u5220\u9664 ", 8, ["onClick"])
                      ]);
                    }), 128))
                  ]),
                  createVNode("div", { class: "form-section" }, [
                    createVNode("h3", null, "\u4EBA\u5DE5\u6210\u672C"),
                    createVNode("button", {
                      type: "button",
                      onClick: addLaborCostItem,
                      class: "btn btn-secondary"
                    }, " \u65B0\u589E\u4EBA\u5DE5\u6210\u672C\u9879 "),
                    (openBlock(true), createBlock(Fragment, null, renderList(formData.value.laborCost, (item, index) => {
                      return openBlock(), createBlock("div", {
                        key: item.id,
                        class: "labor-item"
                      }, [
                        createVNode("div", { class: "form-group" }, [
                          createVNode("label", null, "\u5458\u5DE5\u59D3\u540D *"),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => item.employeeName = $event,
                            type: "text",
                            required: "",
                            placeholder: "\u8BF7\u8F93\u5165\u5458\u5DE5\u59D3\u540D"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, item.employeeName]
                          ])
                        ]),
                        createVNode("div", { class: "form-group" }, [
                          createVNode("label", null, "\u5458\u5DE5\u7EA7\u522B *"),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => item.level = $event,
                            type: "text",
                            required: "",
                            placeholder: "\u8BF7\u8F93\u5165\u5458\u5DE5\u7EA7\u522B"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, item.level]
                          ])
                        ]),
                        createVNode("div", { class: "form-group" }, [
                          createVNode("label", null, "\u65E5\u6210\u672C *"),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => item.dailyCost = $event,
                            type: "number",
                            required: "",
                            placeholder: "\u8BF7\u8F93\u5165\u65E5\u6210\u672C"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [
                              vModelText,
                              item.dailyCost,
                              void 0,
                              { number: true }
                            ]
                          ])
                        ]),
                        createVNode("div", { class: "form-group" }, [
                          createVNode("label", null, "\u6295\u5165\u5929\u6570 *"),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => item.days = $event,
                            type: "number",
                            required: "",
                            placeholder: "\u8BF7\u8F93\u5165\u6295\u5165\u5929\u6570"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [
                              vModelText,
                              item.days,
                              void 0,
                              { number: true }
                            ]
                          ])
                        ]),
                        createVNode("button", {
                          type: "button",
                          onClick: ($event) => removeLaborCostItem(index),
                          class: "btn btn-secondary"
                        }, " \u5220\u9664 ", 8, ["onClick"])
                      ]);
                    }), 128))
                  ]),
                  createVNode("div", { class: "form-section" }, [
                    createVNode("h3", null, "\u5176\u4ED6\u8D39\u7528"),
                    createVNode("button", {
                      type: "button",
                      onClick: addOtherExpenseItem,
                      class: "btn btn-secondary"
                    }, " \u65B0\u589E\u5176\u4ED6\u8D39\u7528\u9879 "),
                    (openBlock(true), createBlock(Fragment, null, renderList(formData.value.otherExpenses, (item, index) => {
                      return openBlock(), createBlock("div", {
                        key: item.id,
                        class: "expense-item"
                      }, [
                        createVNode("div", { class: "form-group" }, [
                          createVNode("label", null, "\u8D39\u7528\u7C7B\u578B *"),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => item.category = $event,
                            type: "text",
                            required: "",
                            placeholder: "\u8BF7\u8F93\u5165\u8D39\u7528\u7C7B\u578B"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, item.category]
                          ])
                        ]),
                        createVNode("div", { class: "form-group" }, [
                          createVNode("label", null, "\u91D1\u989D *"),
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => item.amount = $event,
                            type: "number",
                            required: "",
                            placeholder: "\u8BF7\u8F93\u5165\u91D1\u989D"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [
                              vModelText,
                              item.amount,
                              void 0,
                              { number: true }
                            ]
                          ])
                        ]),
                        createVNode("button", {
                          type: "button",
                          onClick: ($event) => removeOtherExpenseItem(index),
                          class: "btn btn-secondary"
                        }, " \u5220\u9664 ", 8, ["onClick"])
                      ]);
                    }), 128))
                  ]),
                  createVNode("div", { class: "form-actions" }, [
                    createVNode(_component_NuxtLink, {
                      to: "/projects",
                      class: "btn btn-secondary"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u53D6\u6D88")
                      ]),
                      _: 1
                    }),
                    createVNode("button", {
                      type: "submit",
                      class: "btn btn-primary"
                    }, "\u4FDD\u5B58")
                  ])
                ], 32)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/projects/[id]/edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const edit = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1e8ba435"]]);

export { edit as default };
//# sourceMappingURL=edit-DbSsxheA.mjs.map
