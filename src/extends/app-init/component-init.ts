import '@enn/fl-layout/placement-style';
import '@enn/fl-layout/normalize-style';
import type { FlLayout } from '@enn/fl-layout';

export async function componentInit() {
  // 异步加载部分
  import('@enn/fl-result'); // 对于框架主要是用来处理404的，对于页面可以去 enpm 查看 README 文档，基本复刻 antd result 组件。

  const isNoFrame = /no_frame/.test(location.pathname);

  // 同步加载部分
  await Promise.all(!isNoFrame ? [import('@enn/fl-layout')] : []);

  const layout = document.querySelector<FlLayout>('fl-layout');

  if (!layout) {
    throw new Error('cannot found fl-layout dom');
  }

  // registry listener on window
  // so that the router-patcher cans intercept the event
  window.addEventListener('fl-route-change', (_e) => {
    let e = _e as DocumentEventMap['fl-route-change'];
    if (e.detail?.data?.href) {
      history.pushState(
        {
          _fullPath: location.pathname + location.search + location.hash,
          ...history.state,
        },
        '',
        e.detail.data.href
      );
    }
  });

  window.addEventListener('fl-route-back', () => {
    history.back();
  });

  import('native-spa-route').then(({ hook_route_change }) =>
    hook_route_change(() => {
      const targetRouteKey = layout.findNavigateItemKeyByHref(
        location.pathname
      );
      if (!targetRouteKey || layout.activeRouteKey === targetRouteKey) {
        layout.updateBreadcrumbPath(location.pathname);
      } else {
        layout.activeRouteKey = targetRouteKey;
      }
    })
  );

  return {
    layout: layout,
  };
}
