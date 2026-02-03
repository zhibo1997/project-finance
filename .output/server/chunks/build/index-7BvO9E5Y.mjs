import { _ as __nuxt_component_0 } from './Layout-Bn7f3IU0.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-Br-Hzc18.mjs';
import { defineComponent, ref, withCtx, openBlock, createBlock, createVNode, createTextVNode, toDisplayString, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
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
    const stats = ref({
      projectCount: 0,
      completedCount: 0,
      totalIncome: 0,
      totalExpense: 0
    });
    const recentProjects = ref([]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Layout = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_Layout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="homepage" data-v-3a97f29b${_scopeId}><div class="welcome-section" data-v-3a97f29b${_scopeId}><h2 data-v-3a97f29b${_scopeId}>\u6B22\u8FCE\u4F7F\u7528\u9879\u76EE\u7EF4\u5EA6\u8D22\u52A1\u6570\u636E\u7CFB\u7EDF</h2><p data-v-3a97f29b${_scopeId}>\u8FD9\u662F\u4E00\u4E2A\u4E13\u6CE8\u4E8E\u9879\u76EE\u7EF4\u5EA6\u8D22\u52A1\u6570\u636E\u7BA1\u7406\u7684\u7CFB\u7EDF\uFF0C\u5E2E\u52A9\u60A8\u66F4\u597D\u5730\u8DDF\u8E2A\u548C\u5206\u6790\u9879\u76EE\u7684\u8D22\u52A1\u72B6\u51B5\u3002</p></div><div class="stats-section" data-v-3a97f29b${_scopeId}><div class="stat-card" data-v-3a97f29b${_scopeId}><h3 data-v-3a97f29b${_scopeId}>\u9879\u76EE\u603B\u6570</h3><p class="stat-value" data-v-3a97f29b${_scopeId}>${ssrInterpolate(stats.value.projectCount)}</p></div><div class="stat-card" data-v-3a97f29b${_scopeId}><h3 data-v-3a97f29b${_scopeId}>\u5DF2\u5B8C\u6210\u9879\u76EE</h3><p class="stat-value" data-v-3a97f29b${_scopeId}>${ssrInterpolate(stats.value.completedCount)}</p></div><div class="stat-card" data-v-3a97f29b${_scopeId}><h3 data-v-3a97f29b${_scopeId}>\u603B\u6536\u5165</h3><p class="stat-value" data-v-3a97f29b${_scopeId}>\xA5${ssrInterpolate(stats.value.totalIncome.toFixed(2))}</p></div><div class="stat-card" data-v-3a97f29b${_scopeId}><h3 data-v-3a97f29b${_scopeId}>\u603B\u652F\u51FA</h3><p class="stat-value" data-v-3a97f29b${_scopeId}>\xA5${ssrInterpolate(stats.value.totalExpense.toFixed(2))}</p></div></div><div class="quick-actions" data-v-3a97f29b${_scopeId}><h3 data-v-3a97f29b${_scopeId}>\u5FEB\u901F\u64CD\u4F5C</h3><div class="action-buttons" data-v-3a97f29b${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/projects",
              class: "btn btn-primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-3a97f29b${_scopeId2}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" data-v-3a97f29b${_scopeId2}></path><circle cx="12" cy="7" r="4" data-v-3a97f29b${_scopeId2}></circle></svg> \u9879\u76EE\u7BA1\u7406 `);
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
                      createVNode("path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }),
                      createVNode("circle", {
                        cx: "12",
                        cy: "7",
                        r: "4"
                      })
                    ])),
                    createTextVNode(" \u9879\u76EE\u7BA1\u7406 ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/config",
              class: "btn btn-primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-3a97f29b${_scopeId2}><circle cx="12" cy="12" r="3" data-v-3a97f29b${_scopeId2}></circle><path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 1.54l4.24 4.24M20.46 20.46l-4.24-4.24M1.54 20.46l4.24-4.24" data-v-3a97f29b${_scopeId2}></path></svg> \u914D\u7F6E\u7BA1\u7406 `);
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
                      createVNode("circle", {
                        cx: "12",
                        cy: "12",
                        r: "3"
                      }),
                      createVNode("path", { d: "M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 1.54l4.24 4.24M20.46 20.46l-4.24-4.24M1.54 20.46l4.24-4.24" })
                    ])),
                    createTextVNode(" \u914D\u7F6E\u7BA1\u7406 ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/accounting",
              class: "btn btn-primary"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-3a97f29b${_scopeId2}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" data-v-3a97f29b${_scopeId2}></path></svg> \u8BB0\u8D26\u7BA1\u7406 `);
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
                      createVNode("path", { d: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" })
                    ])),
                    createTextVNode(" \u8BB0\u8D26\u7BA1\u7406 ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div><div class="recent-projects" data-v-3a97f29b${_scopeId}><h3 data-v-3a97f29b${_scopeId}>\u6700\u8FD1\u9879\u76EE</h3><div class="project-list" data-v-3a97f29b${_scopeId}><!--[-->`);
            ssrRenderList(recentProjects.value, (project) => {
              _push2(`<div class="project-item" data-v-3a97f29b${_scopeId}><h4 data-v-3a97f29b${_scopeId}>${ssrInterpolate(project.projectName)}</h4><p data-v-3a97f29b${_scopeId}>\u8D1F\u8D23\u4EBA: ${ssrInterpolate(project.projectLeader)}</p><p data-v-3a97f29b${_scopeId}>\u5BA2\u6237: ${ssrInterpolate(project.clientName)}</p><p data-v-3a97f29b${_scopeId}>\u72B6\u6001: ${ssrInterpolate(project.status)}</p>`);
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
              _push2(`</div>`);
            });
            _push2(`<!--]--></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "homepage" }, [
                createVNode("div", { class: "welcome-section" }, [
                  createVNode("h2", null, "\u6B22\u8FCE\u4F7F\u7528\u9879\u76EE\u7EF4\u5EA6\u8D22\u52A1\u6570\u636E\u7CFB\u7EDF"),
                  createVNode("p", null, "\u8FD9\u662F\u4E00\u4E2A\u4E13\u6CE8\u4E8E\u9879\u76EE\u7EF4\u5EA6\u8D22\u52A1\u6570\u636E\u7BA1\u7406\u7684\u7CFB\u7EDF\uFF0C\u5E2E\u52A9\u60A8\u66F4\u597D\u5730\u8DDF\u8E2A\u548C\u5206\u6790\u9879\u76EE\u7684\u8D22\u52A1\u72B6\u51B5\u3002")
                ]),
                createVNode("div", { class: "stats-section" }, [
                  createVNode("div", { class: "stat-card" }, [
                    createVNode("h3", null, "\u9879\u76EE\u603B\u6570"),
                    createVNode("p", { class: "stat-value" }, toDisplayString(stats.value.projectCount), 1)
                  ]),
                  createVNode("div", { class: "stat-card" }, [
                    createVNode("h3", null, "\u5DF2\u5B8C\u6210\u9879\u76EE"),
                    createVNode("p", { class: "stat-value" }, toDisplayString(stats.value.completedCount), 1)
                  ]),
                  createVNode("div", { class: "stat-card" }, [
                    createVNode("h3", null, "\u603B\u6536\u5165"),
                    createVNode("p", { class: "stat-value" }, "\xA5" + toDisplayString(stats.value.totalIncome.toFixed(2)), 1)
                  ]),
                  createVNode("div", { class: "stat-card" }, [
                    createVNode("h3", null, "\u603B\u652F\u51FA"),
                    createVNode("p", { class: "stat-value" }, "\xA5" + toDisplayString(stats.value.totalExpense.toFixed(2)), 1)
                  ])
                ]),
                createVNode("div", { class: "quick-actions" }, [
                  createVNode("h3", null, "\u5FEB\u901F\u64CD\u4F5C"),
                  createVNode("div", { class: "action-buttons" }, [
                    createVNode(_component_NuxtLink, {
                      to: "/projects",
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
                          createVNode("path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }),
                          createVNode("circle", {
                            cx: "12",
                            cy: "7",
                            r: "4"
                          })
                        ])),
                        createTextVNode(" \u9879\u76EE\u7BA1\u7406 ")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_NuxtLink, {
                      to: "/config",
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
                          createVNode("circle", {
                            cx: "12",
                            cy: "12",
                            r: "3"
                          }),
                          createVNode("path", { d: "M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 1.54l4.24 4.24M20.46 20.46l-4.24-4.24M1.54 20.46l4.24-4.24" })
                        ])),
                        createTextVNode(" \u914D\u7F6E\u7BA1\u7406 ")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_NuxtLink, {
                      to: "/accounting",
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
                          createVNode("path", { d: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" })
                        ])),
                        createTextVNode(" \u8BB0\u8D26\u7BA1\u7406 ")
                      ]),
                      _: 1
                    })
                  ])
                ]),
                createVNode("div", { class: "recent-projects" }, [
                  createVNode("h3", null, "\u6700\u8FD1\u9879\u76EE"),
                  createVNode("div", { class: "project-list" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(recentProjects.value, (project) => {
                      return openBlock(), createBlock("div", {
                        key: project.id,
                        class: "project-item"
                      }, [
                        createVNode("h4", null, toDisplayString(project.projectName), 1),
                        createVNode("p", null, "\u8D1F\u8D23\u4EBA: " + toDisplayString(project.projectLeader), 1),
                        createVNode("p", null, "\u5BA2\u6237: " + toDisplayString(project.clientName), 1),
                        createVNode("p", null, "\u72B6\u6001: " + toDisplayString(project.status), 1),
                        createVNode(_component_NuxtLink, {
                          to: `/projects/${project.id}`,
                          class: "btn btn-secondary"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("\u67E5\u770B\u8BE6\u60C5")
                          ]),
                          _: 1
                        }, 8, ["to"])
                      ]);
                    }), 128))
                  ])
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3a97f29b"]]);

export { index as default };
//# sourceMappingURL=index-7BvO9E5Y.mjs.map
