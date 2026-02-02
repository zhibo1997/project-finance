export function apmInit(
  consoleError?: boolean,
  /**
   * 是否上报Vue错误
   */
  vueError?: boolean,
  vue?: any,
) {
  const options = {
    /**
     * 发布平台的租户ID
     * 1369923265280311297 # 新奥新智
     * 1387330602944675842 # 新奥数能
     * 1384342759875670018 # 新奥股份
     */
    pageId: import.meta.env.QI_DEVOPS_APP_ID,
    tenantId: import.meta.env.QI_TENANT_ID, 
    consoleError: consoleError ?? true,
    vueError: vueError ?? true, 
    vue: vue,
    env: MonitorJS.EnnPROD,
  };
  switch (import.meta.env.ENV) {
    case 'DEV':
      options.env = MonitorJS.EnnDEV;
      break;
    case 'FAT':
      options.env = MonitorJS.EnnFAT;
      break;
    case 'UAT':
      options.env = MonitorJS.EnnUAT;
      break;
    case 'PRO':
      options.env = MonitorJS.EnnPROD;
      break;
  }
  new MonitorJS().init(options);
  window.dispatchEvent(new CustomEvent('apm-init-end'));
}