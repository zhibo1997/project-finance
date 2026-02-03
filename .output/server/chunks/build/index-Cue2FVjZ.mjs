import { _ as __nuxt_component_0 } from './Layout-Bn7f3IU0.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-Br-Hzc18.mjs';
import { defineComponent, ref, withCtx, openBlock, createBlock, createVNode, createTextVNode, withDirectives, vModelText, vModelSelect, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const projects = ref({
      list: [],
      total: 0,
      page: 1,
      size: 20
    });
    const searchParams = ref({
      keyword: "",
      status: ""
    });
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString();
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
    const fetchProjects = async () => {
      try {
        const params = new URLSearchParams();
        params.append("page", projects.value.page.toString());
        params.append("size", projects.value.size.toString());
        if (searchParams.value.keyword) {
          params.append("keyword", searchParams.value.keyword);
        }
        if (searchParams.value.status) {
          params.append("status", searchParams.value.status);
        }
        const response = await $fetch(`/api/projects?${params.toString()}`);
        if ((response == null ? void 0 : response.code) === 0) {
          projects.value = response.data;
        }
      } catch (error2) {
        console.error("\u83B7\u53D6\u9879\u76EE\u5217\u8868\u5931\u8D25:", error2);
      }
    };
    const searchProjects = () => {
      projects.value.page = 1;
      fetchProjects();
    };
    const changePage = (page) => {
      projects.value.page = page;
      fetchProjects();
    };
    const copyProject = async (id) => {
      try {
        const response = await $fetch(`/api/projects/${id}/copy`, {
          method: "POST"
        });
        if ((response == null ? void 0 : response.code) === 0) {
          alert("\u9879\u76EE\u590D\u5236\u6210\u529F");
          fetchProjects();
        } else {
          alert((response == null ? void 0 : response.message) || "\u590D\u5236\u9879\u76EE\u5931\u8D25");
        }
      } catch (error2) {
        console.error("\u590D\u5236\u9879\u76EE\u5931\u8D25:", error2);
        alert("\u590D\u5236\u9879\u76EE\u5931\u8D25");
      }
    };
    const deleteProject = async (id) => {
      if (!confirm("\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u9879\u76EE\u5417\uFF1F")) {
        return;
      }
      try {
        const response = await $fetch(`/api/projects/${id}`, {
          method: "DELETE"
        });
        if ((response == null ? void 0 : response.code) === 0) {
          alert("\u9879\u76EE\u5220\u9664\u6210\u529F");
          fetchProjects();
        } else {
          alert((response == null ? void 0 : response.message) || "\u5220\u9664\u9879\u76EE\u5931\u8D25");
        }
      } catch (error2) {
        console.error("\u5220\u9664\u9879\u76EE\u5931\u8D25:", error2);
        alert("\u5220\u9664\u9879\u76EE\u5931\u8D25");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Layout = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_Layout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="projects-page" data-v-3257e87e${_scopeId}><div class="page-header" data-v-3257e87e${_scopeId}><h2 data-v-3257e87e${_scopeId}>\u9879\u76EE\u7BA1\u7406</h2>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/projects/new",
              class: "btn btn-primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-3257e87e${_scopeId2}><line x1="12" y1="5" x2="12" y2="19" data-v-3257e87e${_scopeId2}></line><line x1="5" y1="12" x2="19" y2="12" data-v-3257e87e${_scopeId2}></line></svg> \u65B0\u5EFA\u9879\u76EE `);
                } else {
                  return [
                    (openBlock(), createBlock("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: "16",
                      height: "16",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    }, [
                      createVNode("line", {
                        x1: "12",
                        y1: "5",
                        x2: "12",
                        y2: "19"
                      }),
                      createVNode("line", {
                        x1: "5",
                        y1: "12",
                        x2: "19",
                        y2: "12"
                      })
                    ])),
                    createTextVNode(" \u65B0\u5EFA\u9879\u76EE ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="search-section" data-v-3257e87e${_scopeId}><input${ssrRenderAttr("value", searchParams.value.keyword)} type="text" placeholder="\u641C\u7D22\u9879\u76EE\u540D\u79F0\u3001\u5BA2\u6237\u6216\u8D1F\u8D23\u4EBA..." class="search-input" data-v-3257e87e${_scopeId}><select class="status-select" data-v-3257e87e${_scopeId}><option value="" data-v-3257e87e${ssrIncludeBooleanAttr(Array.isArray(searchParams.value.status) ? ssrLooseContain(searchParams.value.status, "") : ssrLooseEqual(searchParams.value.status, "")) ? " selected" : ""}${_scopeId}>\u6240\u6709\u72B6\u6001</option><option value="draft" data-v-3257e87e${ssrIncludeBooleanAttr(Array.isArray(searchParams.value.status) ? ssrLooseContain(searchParams.value.status, "draft") : ssrLooseEqual(searchParams.value.status, "draft")) ? " selected" : ""}${_scopeId}>\u8349\u7A3F</option><option value="submitted" data-v-3257e87e${ssrIncludeBooleanAttr(Array.isArray(searchParams.value.status) ? ssrLooseContain(searchParams.value.status, "submitted") : ssrLooseEqual(searchParams.value.status, "submitted")) ? " selected" : ""}${_scopeId}>\u5DF2\u63D0\u4EA4</option><option value="completed" data-v-3257e87e${ssrIncludeBooleanAttr(Array.isArray(searchParams.value.status) ? ssrLooseContain(searchParams.value.status, "completed") : ssrLooseEqual(searchParams.value.status, "completed")) ? " selected" : ""}${_scopeId}>\u5DF2\u5B8C\u6210</option><option value="closed" data-v-3257e87e${ssrIncludeBooleanAttr(Array.isArray(searchParams.value.status) ? ssrLooseContain(searchParams.value.status, "closed") : ssrLooseEqual(searchParams.value.status, "closed")) ? " selected" : ""}${_scopeId}>\u5DF2\u7ED3\u9879</option></select><button class="btn btn-primary" data-v-3257e87e${_scopeId}>\u641C\u7D22</button></div><div class="projects-list" data-v-3257e87e${_scopeId}><!--[-->`);
            ssrRenderList(projects.value.list, (project) => {
              _push2(`<div class="project-card" data-v-3257e87e${_scopeId}><div class="project-info" data-v-3257e87e${_scopeId}><h3 data-v-3257e87e${_scopeId}>${ssrInterpolate(project.projectName)}</h3><p data-v-3257e87e${_scopeId}>\u8D1F\u8D23\u4EBA: ${ssrInterpolate(project.projectLeader)}</p><p data-v-3257e87e${_scopeId}>\u5BA2\u6237: ${ssrInterpolate(project.clientName)}</p><p data-v-3257e87e${_scopeId}>\u9879\u76EE\u7C7B\u578B: ${ssrInterpolate(project.projectType)}</p><p data-v-3257e87e${_scopeId}>\u670D\u52A1\u65E5\u671F: ${ssrInterpolate(formatDate(project.serviceStartDate))} - ${ssrInterpolate(formatDate(project.serviceEndDate))}</p><p data-v-3257e87e${_scopeId}>\u670D\u52A1\u91D1\u989D: \xA5${ssrInterpolate(project.serviceAmount.toFixed(2))}</p><p data-v-3257e87e${_scopeId}>\u72B6\u6001: <span class="${ssrRenderClass(getStatusClass(project.status))}" data-v-3257e87e${_scopeId}>${ssrInterpolate(getStatusText(project.status))}</span></p></div><div class="project-actions" data-v-3257e87e${_scopeId}>`);
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: `/projects/${project.id}`,
                class: "btn btn-secondary"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`\u67E5\u770B\u8BE6\u60C5`);
                  } else {
                    return [
                      createTextVNode("\u67E5\u770B\u8BE6\u60C5")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: `/projects/${project.id}/edit`,
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
              _push2(`<button class="btn btn-secondary" data-v-3257e87e${_scopeId}>\u590D\u5236</button><button class="btn btn-secondary" style="${ssrRenderStyle({ "background-color": "#ff4d4f", "color": "white" })}" data-v-3257e87e${_scopeId}>\u5220\u9664</button></div></div>`);
            });
            _push2(`<!--]--></div>`);
            if (projects.value.total > projects.value.size) {
              _push2(`<div class="pagination" data-v-3257e87e${_scopeId}><button${ssrIncludeBooleanAttr(projects.value.page <= 1) ? " disabled" : ""} class="btn btn-secondary" data-v-3257e87e${_scopeId}>\u4E0A\u4E00\u9875</button><span data-v-3257e87e${_scopeId}>\u7B2C ${ssrInterpolate(projects.value.page)} \u9875 / \u5171 ${ssrInterpolate(Math.ceil(projects.value.total / projects.value.size))} \u9875</span><button${ssrIncludeBooleanAttr(projects.value.page >= Math.ceil(projects.value.total / projects.value.size)) ? " disabled" : ""} class="btn btn-secondary" data-v-3257e87e${_scopeId}>\u4E0B\u4E00\u9875</button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "projects-page" }, [
                createVNode("div", { class: "page-header" }, [
                  createVNode("h2", null, "\u9879\u76EE\u7BA1\u7406"),
                  createVNode(_component_NuxtLink, {
                    to: "/projects/new",
                    class: "btn btn-primary"
                  }, {
                    default: withCtx(() => [
                      (openBlock(), createBlock("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        width: "16",
                        height: "16",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round"
                      }, [
                        createVNode("line", {
                          x1: "12",
                          y1: "5",
                          x2: "12",
                          y2: "19"
                        }),
                        createVNode("line", {
                          x1: "5",
                          y1: "12",
                          x2: "19",
                          y2: "12"
                        })
                      ])),
                      createTextVNode(" \u65B0\u5EFA\u9879\u76EE ")
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { class: "search-section" }, [
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => searchParams.value.keyword = $event,
                    type: "text",
                    placeholder: "\u641C\u7D22\u9879\u76EE\u540D\u79F0\u3001\u5BA2\u6237\u6216\u8D1F\u8D23\u4EBA...",
                    class: "search-input"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, searchParams.value.keyword]
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => searchParams.value.status = $event,
                    class: "status-select"
                  }, [
                    createVNode("option", { value: "" }, "\u6240\u6709\u72B6\u6001"),
                    createVNode("option", { value: "draft" }, "\u8349\u7A3F"),
                    createVNode("option", { value: "submitted" }, "\u5DF2\u63D0\u4EA4"),
                    createVNode("option", { value: "completed" }, "\u5DF2\u5B8C\u6210"),
                    createVNode("option", { value: "closed" }, "\u5DF2\u7ED3\u9879")
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, searchParams.value.status]
                  ]),
                  createVNode("button", {
                    onClick: searchProjects,
                    class: "btn btn-primary"
                  }, "\u641C\u7D22")
                ]),
                createVNode("div", { class: "projects-list" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(projects.value.list, (project) => {
                    return openBlock(), createBlock("div", {
                      key: project.id,
                      class: "project-card"
                    }, [
                      createVNode("div", { class: "project-info" }, [
                        createVNode("h3", null, toDisplayString(project.projectName), 1),
                        createVNode("p", null, "\u8D1F\u8D23\u4EBA: " + toDisplayString(project.projectLeader), 1),
                        createVNode("p", null, "\u5BA2\u6237: " + toDisplayString(project.clientName), 1),
                        createVNode("p", null, "\u9879\u76EE\u7C7B\u578B: " + toDisplayString(project.projectType), 1),
                        createVNode("p", null, "\u670D\u52A1\u65E5\u671F: " + toDisplayString(formatDate(project.serviceStartDate)) + " - " + toDisplayString(formatDate(project.serviceEndDate)), 1),
                        createVNode("p", null, "\u670D\u52A1\u91D1\u989D: \xA5" + toDisplayString(project.serviceAmount.toFixed(2)), 1),
                        createVNode("p", null, [
                          createTextVNode("\u72B6\u6001: "),
                          createVNode("span", {
                            class: getStatusClass(project.status)
                          }, toDisplayString(getStatusText(project.status)), 3)
                        ])
                      ]),
                      createVNode("div", { class: "project-actions" }, [
                        createVNode(_component_NuxtLink, {
                          to: `/projects/${project.id}`,
                          class: "btn btn-secondary"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("\u67E5\u770B\u8BE6\u60C5")
                          ]),
                          _: 1
                        }, 8, ["to"]),
                        createVNode(_component_NuxtLink, {
                          to: `/projects/${project.id}/edit`,
                          class: "btn btn-secondary"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("\u7F16\u8F91")
                          ]),
                          _: 1
                        }, 8, ["to"]),
                        createVNode("button", {
                          onClick: ($event) => copyProject(project.id),
                          class: "btn btn-secondary"
                        }, "\u590D\u5236", 8, ["onClick"]),
                        createVNode("button", {
                          onClick: ($event) => deleteProject(project.id),
                          class: "btn btn-secondary",
                          style: { "background-color": "#ff4d4f", "color": "white" }
                        }, "\u5220\u9664", 8, ["onClick"])
                      ])
                    ]);
                  }), 128))
                ]),
                projects.value.total > projects.value.size ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "pagination"
                }, [
                  createVNode("button", {
                    onClick: ($event) => changePage(projects.value.page - 1),
                    disabled: projects.value.page <= 1,
                    class: "btn btn-secondary"
                  }, "\u4E0A\u4E00\u9875", 8, ["onClick", "disabled"]),
                  createVNode("span", null, "\u7B2C " + toDisplayString(projects.value.page) + " \u9875 / \u5171 " + toDisplayString(Math.ceil(projects.value.total / projects.value.size)) + " \u9875", 1),
                  createVNode("button", {
                    onClick: ($event) => changePage(projects.value.page + 1),
                    disabled: projects.value.page >= Math.ceil(projects.value.total / projects.value.size),
                    class: "btn btn-secondary"
                  }, "\u4E0B\u4E00\u9875", 8, ["onClick", "disabled"])
                ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/projects/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3257e87e"]]);

export { index as default };
//# sourceMappingURL=index-Cue2FVjZ.mjs.map
