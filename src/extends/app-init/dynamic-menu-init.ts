import type { TMenuConfig } from '@enn/fl-app-frame-side-menu'
import type { FlLayout } from '@enn/fl-layout'

export async function dynamicMenuInit(
  layout: FlLayout,
  fetchMenuData: () => Promise<TMenuConfig>,
) {
  const data = await fetchMenuData()
  layout.menuData = data;
}
