import type { FlLayout } from '@enn/fl-layout';

/**
 * 首次 activeRouteKey 同步
 */
export function layoutActiveRouteKeyInit(basepath: string, layout: FlLayout) {
  let targetNavigateItemKey: string | null = null;
  targetNavigateItemKey = layout.findNavigateItemKeyByHref(location.pathname);
  if (!targetNavigateItemKey) {
    targetNavigateItemKey = layout.findNavigateItemKeyByHref(
      location.pathname.replace(basepath, '/')
    );
  }
  if (targetNavigateItemKey) {
    layout.activeRouteKey = targetNavigateItemKey;
  }
}
