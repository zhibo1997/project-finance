// import type { Header as FlHeader } from '@enn/fl-app-frame-header';
import type { FlLayout } from '@enn/fl-layout';

export type HeaderTenantConfig = {
  key: string;
  label: string;
}[];

export type HeaderUserInfo = {
  title: string;
  subTitle?: string;
  logo?: string;
  tenantId?: string;
  tenantName?: string;
  tenantConfig?: HeaderTenantConfig;
};

export async function userInfoInit(
  layout: FlLayout,
  fetchUserInfo: () => Promise<HeaderUserInfo> | HeaderUserInfo,
  onTenantSelect: () => void,
  onSignOut: () => void
) {
  if (!layout || layout.tagName !== 'FL-LAYOUT') return;

  /**
   * #[tenant-config]
   * 租户设置
   */
  layout.activeTenantKey = 'unknow';
  layout.tenantConfig = [
    {
      key: 'unknow',
      label: '...',
    },
    {
      key: 'select',
      label: '选择租户',
    },
  ];

  /**
   * #[userinfo-placeholder]
   * 用户信息占位设置
   */
  layout.userInfo = {
    title: '...',
    subTitle: '',
    logo: '',
  };

  layout.addEventListener('fl-select-tenant', () => {
    // authsdk.selectTenant();
    onTenantSelect?.();
  });

  let userInfo = await fetchUserInfo();

  if (userInfo.tenantId) {
    layout.activeTenantKey = String(userInfo.tenantId);
  }

  if (userInfo.tenantConfig) {
    layout.tenantConfig = [
      {
        key: String(userInfo.tenantId),
        label: String(userInfo.tenantName),
      },
      {
        key: 'select',
        label: '其他租户',
      },
    ];
  } else {
    layout.headerConfig = {
      ...(layout.headerConfig || {}),
      noTenant: true,
    };
  }

  if (userInfo?.title) {
    layout.userInfo = {
      title: userInfo.title,
      subTitle: userInfo.subTitle ?? '',
      logo: userInfo.subTitle ?? '',
    };
    layout.addEventListener('fl-sign-out', () => {
      onSignOut?.();
    });
  } else {
    layout.userInfo = {
      title: '未登录',
      subTitle: '',
      logo: '',
    };
  }
}
