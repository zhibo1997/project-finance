/***************
 *
 * 此文件用于处理全局副作用。
 * This file use to support global functions.
 *
 * 如无必要，不要更改这个文件，除非你知道你在做什么！
 * Do never edit this file, unless you know what you are doing!
 *
 ***************/

/**
 * #[ency-design-tokens]
 * 获取 ency design token
 */
import "@enn/ency-design-tokens/styles/index.css";

import { apmInit } from "./extends/app-init/apm-init";
import type { AuthSdk } from "./extends/app-init/auth-init";
import {
  ennAuthSDKInit /* 参与者中心 SDK 初始化 */,
  mdataEnnAuthSDKInit /* 帐控中心 SDK 初始化 */,
} from "./extends/app-init/auth-init";
import { componentInit } from "./extends/app-init/component-init";
import { userInfoInit } from "./extends/app-init/user-info-init";
import { dynamicMenuInit } from "./extends/app-init/dynamic-menu-init";
import { iframeSubpageInit } from "./extends/app-init/iframe-subpage-init";
import { nativeRouteInit } from "./extends/app-init/native-route-init";
import { layoutActiveRouteKeyInit } from "./extends/app-init/init-active-route-key";
import { FlLayout } from "@enn/fl-layout";

async function main() {
  /**
   * #[no_frame_check]
   * 判断是否需要处理框架组件
   */
  const isNoFrame = /no_frame/.test(location.pathname);

  /**
   * #[apm-init]
   * apm 初始化
   */
  apmInit();

  /**
   * #[base-path-init]
   * 获取 air 的根路径
   */
  const basePath = (
    document.querySelector('meta[name="fl-root-href"]') as HTMLMetaElement
  ).content;

  /**
   * #[auth-init]
   * 初始化鉴权SDK
   * 按需调整，配置需要手动调整，位置在 ./src/extends/auth-init.ts。
   */
  let authSdk: AuthSdk = {
    selectTenant() {},
    logout() {},
    transformToAuthUrl(url, _tenant = "none") {
      return url;
    },
  };
  try {
    // TODO: 切换成需要的SDK
    // authSdk = await ennAuthSDKInit();
    // authSdk = await mdataEnnAuthSDKInit();
  } catch (error) {
    console.error("初始化鉴权SDK失败\n", error);
  }

  /**
   * #[component-init]
   * 初始化组件依赖
   */
  let layout: FlLayout | undefined;
  if (!isNoFrame) {
    const components = await componentInit();
    layout = components.layout;
  } else {
    layout = undefined;
  }

  /**
   * #[header-config]
   * 配置 header 属性
   */
  // layout.headerConfig = {
  //   noAdditional: false,
  //   noContact: false,
  //   noFavorite: false,
  //   noNotice: false,
  //   noOverflow: false,
  //   noProductSwitch: false,
  //   noSearch: false,
  //   noTodo: false,
  // };

  /**
   * #[user-info-init]
   * 初始化用户信息
   */
  if (layout) {
    await userInfoInit(
      layout,
      () => {
        /* TODO: 编写获取用户信息的函数 */
        return {
          title: "",
        };
      },
      authSdk.selectTenant /* 处理选择租户 */,
      authSdk.logout /* 处理退出登录 */,
    );
  }

  /**
   * #[native-route-init]
   * 原生路由核心库初始化
   */
  nativeRouteInit(
    /* 根路由配置 */
    basePath,
    /* 路由映射配置 */
    // {
    //   '/': '/<to route>',
    //   [`/${basePath}`]: '/<to path>',
    // }
  );

  /**
   * #[dynamic-menu-init]
   * 初始化动态菜单
   * 按需开启
   */
  // if (layout) {
  //   dynamicMenuInit(layout as FlLayout, () => {
  //     /* TODO: 编写获取用户信息的函数 */
  //     // return authSDK.getAppMenus();
  //     return Promise.resolve([]);
  //   }).then(() => {
  //     layoutActiveRouteKeyInit(basePath, layout);
  //   });
  // }

  if (layout) {
    layoutActiveRouteKeyInit(basePath, layout);
  }

  /**
   * #[iframe-subpage-init]
   * iframe 类型子页面接入逻辑
   * 可选项，有需要就开启
   */
  // iframeSubpageInit(basePath, authSdk);
}

main();

/* #[slot("dynamic-imports")] */
export {};
