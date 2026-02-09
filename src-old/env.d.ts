/// <reference types="vite/client" />

class MonitorJS {
  init: Function
  static EnnDEV: string
  static EnnFAT: string
  static EnnUAT: string
  static EnnPROD: string
}

interface Window {
  MonitorJS: MonitorJS
}

interface ImportMeta {
  url: string

  readonly env: {
    ENV: 'LOC' | 'DEV' | 'FAT' | 'UAT' | 'PRO'
    VITE_APM_TENANT_ID: string
    // 参与者中心用户信息接口
    VITE_ENN_USER_INFO_API: string
    VITE_MDATA_ENN_USER_INFO_API: string
  }
}
