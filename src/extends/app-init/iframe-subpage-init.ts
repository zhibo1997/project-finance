/**
 * 该初始化流程各应用差异可能会很大，有问题可以咨询 @周一鸣
 */

import type { Route } from 'native-spa-route';

export function iframeSubpageInit(
  basePath: string,
  auth_sdk: {
    transformToAuthUrl(str: string, tenantType?: 'local' | string): string;
    logout: () => void;
  }
) {
  const routeList = Array.from(
    document.querySelectorAll('native-route[groupmatchmode]')
  ) as Route[];
  let routes = routeList.filter((t) => /iframe/.test(t.element));

  if (routes.length) {
    import('@enn/fl-iframe-vue-router-talker').then((module) => {
      const { syncToChild, listenChild } = module;

      for (const r of routes) {
        // overwrite iframe's src with authed params
        const iframeSrc = /src="([^"]+)"/.exec(r.element)?.[1];
        if (typeof iframeSrc !== 'string') continue;

        const iframeSearchParams = new URLSearchParams(
          iframeSrc.replace(/^.*\?/, '')
        );
        if (!iframeSearchParams.has('no_frame')) {
          iframeSearchParams.set('no_frame', '1');
        }

        let _src = iframeSrc.replace(
          /\?.*$/,
          `?${iframeSearchParams.toString()}`
        );
        r.element = r.element.replace(
          /src="[^"]+"/,
          'src=' +
            (typeof auth_sdk?.transformToAuthUrl === 'function'
              ? auth_sdk.transformToAuthUrl(_src, 'local')
              : _src)
        );

        //  let iframeBasePath = /data-base-path="([^"]*)"/.exec(r.element)?.[1] ?? '';

        // will auto handle history change
        listenChild((data) => {
          if (!r.isActive())
            return console.log(
              'current route not active, stop sync route change'
            );
          //  console.group('child sync to parent');
          //  console.log('data: ', data);
          if (data.type === 'init') {
            syncToIframe();
          }
          if (data.type === 'push') {
            history.replaceState(
              null,
              '',
              // 子应用如果设置了 base path，就不需要加 iframeBasePath 适配
              // data.toPath.startsWith(`/${iframeBasePath}`)
              //   ? data.toPath.replace(`/${iframeBasePath}, '/')
              //   : data.toPath
              `${basePath === '/' ? '' : basePath}/${data.toPath.replace(
                /^\//,
                ''
              )}`
            );
          }
          if (data.type === 'back') {
            // 按需开启
            // history.back();
          }

          // 内部登录态失效捕获
          if (data.type === 'auth_invalid') {
            auth_sdk.logout();
          }
        });

        const syncToIframe = () => {
          if (!r.isActive()) return;
          const prefix = r.getFullPath().replace(r.path, '').replace(/\/$/, '');
          if (location.pathname.startsWith(prefix)) {
            const targetPath = location.pathname.replace(
              prefix,
              '' // 子应用如果设置了 base path，就不需要加 iframeBasePath 适配
            );
            syncToChild(r.querySelector('iframe') as HTMLIFrameElement, {
              type: 'push',
              toPath: targetPath ?? '/',
            });
          }
        };

        window.addEventListener('fl-route-change', syncToIframe);
      }
    });
  }
}
