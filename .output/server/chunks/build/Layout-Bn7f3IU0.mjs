import { _ as __nuxt_component_0$1 } from './nuxt-link-Br-Hzc18.mjs';
import { mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-container" }, _attrs))} data-v-35db4a39><header class="app-header" data-v-35db4a39><div class="container" data-v-35db4a39><h1 data-v-35db4a39>\u9879\u76EE\u7EF4\u5EA6\u8D22\u52A1\u6570\u636E\u7CFB\u7EDF</h1><nav class="app-nav" data-v-35db4a39>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    class: "nav-link"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`\u9996\u9875`);
      } else {
        return [
          createTextVNode("\u9996\u9875")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/projects",
    class: "nav-link"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`\u9879\u76EE\u7BA1\u7406`);
      } else {
        return [
          createTextVNode("\u9879\u76EE\u7BA1\u7406")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/config",
    class: "nav-link"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`\u914D\u7F6E\u7BA1\u7406`);
      } else {
        return [
          createTextVNode("\u914D\u7F6E\u7BA1\u7406")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/accounting",
    class: "nav-link"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`\u8BB0\u8D26\u7BA1\u7406`);
      } else {
        return [
          createTextVNode("\u8BB0\u8D26\u7BA1\u7406")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</nav></div></header><main class="app-main" data-v-35db4a39><div class="container" data-v-35db4a39>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div></main><footer class="app-footer" data-v-35db4a39><div class="container" data-v-35db4a39><p data-v-35db4a39>\u9879\u76EE\u7EF4\u5EA6\u8D22\u52A1\u6570\u636E\u7CFB\u7EDF \xA9 2026</p></div></footer></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Layout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-35db4a39"]]);

export { __nuxt_component_0 as _ };
//# sourceMappingURL=Layout-Bn7f3IU0.mjs.map
