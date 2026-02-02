
/*
  按需选用，没用到的可以直接删掉后者忽略都行；
 */

const AUTH_CONFIG = {
  initAuth: true, // 自动触发登录
  appid: /* TODO: appid */ '', // 前端项目APPID（实际鉴权时用的是后端登陆sdk里配的appid）
  baseUrl: /* TODO: baseUrl */ '', // 接口地址
  // env: import.meta.env.VITE_APP_ENV, // 当前环境 NEW_DEV NEW_FAT NEW_UAT NEW_PRO
  // accessKey: import.meta.env.VITE_GW_ACCESSKEY, // 网关地址（接口通过rdfa网关访问时必传）
}

export type AuthSdk = {
  selectTenant: () => void
  logout: () => void
  transformToAuthUrl: (url: string, tenant?: string) => string
}

export async function mdataEnnAuthSDKInit() {
  // @ts-ignore
  const { default: SDK } = await import('@enncloud/mdata-enn-auth-sdk');
  return new SDK(AUTH_CONFIG) as AuthSdk;
}

export async function ennAuthSDKInit() {
  // @ts-ignore
  const { default: SDK } = await import('@enncloud/enn-auth-sdk')
  return SDK(AUTH_CONFIG)
}

// export async function efetchInit() {
//   const { EnnAuthFetch } = await import('@enn/fetch-with-auth');
//   return new EnnAuthFetch(AUTH_CONFIG) as AuthSdk;
// }