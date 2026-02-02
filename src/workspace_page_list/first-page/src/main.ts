import { createApp, App } from 'vue';
import '@enn/ency-design/theme-chalk/el-msg-toast.css';
import { createRouter, createWebHistory } from 'vue-router';
import { getBasePath, patcher as vueRouterPatcher } from '@enn/fl-vue-router-patcher';

import app from './App.vue';
import home from './pages/home/index.vue';
import list from './pages/list/index.vue';

let app_instance: App<Element>;
let unhook: any;

export function render(target: string | Element) {
  let renderRoot: Element | null;
  if (typeof target === 'string') {
    renderRoot = document.querySelector(target);
  } else {
    renderRoot = target;
  }

  if (!renderRoot) return console.warn('cannot found render target dom');

  const basePath = getBasePath(renderRoot);

  const innerRouter = createRouter({
    history: createWebHistory(basePath),
    routes: [
      {
        path: '/',
        name: 'home',
        component: home,
      },
      {
        path: '/list',
        name: 'list',
        component: list,
        meta: {
          label: "列表"
        }
      },
    ],
  });

  unhook = vueRouterPatcher(renderRoot, innerRouter);

  app_instance = createApp(app);
  app_instance.use(innerRouter);
  app_instance.mount(renderRoot);
}

export function destroy() {
  app_instance?.unmount?.();
  unhook?.();
}
