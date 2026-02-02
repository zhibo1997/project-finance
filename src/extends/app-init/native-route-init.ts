import type { RouteContainer, Route } from 'native-spa-route'

import { content_404 } from '../404'

/**
 *
 * @param basePath 根路由，一般用于处理 air 的附加路径
 * @param redirectMap 路由映射配置，一般用于从根路径跳转到其他路径
 */
export async function nativeRouteInit(basePath: string, redirectMap: Record<string, string> = {}) {
  const { hook_history_change } = await import('native-spa-route')

  // hook route change
  // update breadcrumb and menu state
  hook_history_change({
    url_adapter: (_url) => {
      const url = _url?.toString() || '';
      if (typeof url === 'string') {
        let ret = url
        // handle root href
        const is_start_with_slash = ret.startsWith('/');
        if (is_start_with_slash && !ret.startsWith(basePath)) {
          // prettier-ignore
          ret = `${basePath}${is_start_with_slash ? '' : '/'}${ret}`;
        }
        for (const mapKey in redirectMap) {
          if (Object.prototype.hasOwnProperty.call(redirectMap, mapKey)) {
            const mapValue = redirectMap[mapKey]
            if (ret === mapKey) {
              return mapValue.startsWith(basePath)
                ? mapValue
                : basePath + (mapValue.startsWith('/') ? mapValue : `/${mapValue}`)
            }
          }
        }
        return ret
      }
      return url
    },
  })

  history.pushState(null, '', location.pathname + location.search)

  /**
   * 配置 404 内容
   */
  const routeContainerList: NodeListOf<RouteContainer> = document.querySelectorAll(
    'native-route-container[disableShadow]',
  )
  routeContainerList.forEach((r) => {
    r.set404Content(content_404)
  })

  /**
   * 运行时 error render 注入
   */
  if (import.meta.env.IS_LOCAL == '1') {
    // 只在本地环境开启
    import('../error-render').then(({ content_error }) => {
      if (content_error) {
        const routeList: NodeListOf<Route> = document.querySelectorAll('native-route')
        routeList.forEach((r) => {
          r.errorRender = content_error
        })
      }
    })
  }

  /**
   * 运行时 loading 注入
   * NOTE: 默认不开启运行时 loading 注入，页面多的时候开销比较大，推荐使用 package.json 的 `fl-config.custom-loading` 配置。
   */
  // const routeList: NodeListOf<Route> = document.querySelectorAll('native-route');
  // routeList.forEach(r => {
  //   r.loadingElement = content_loading;
  // });

  /**
   * 配置根路由跳转
   * （此方式体验不如url检测直接修改，已废弃）
   */
  // for (const redirectFrom in redirectMap) {
  //   if (Object.prototype.hasOwnProperty.call(redirectMap, redirectFrom)) {
  //     const redirectTo = redirectMap[redirectFrom];
  //     redirect(redirectFrom, redirectTo);
  //   }
  // }
}
