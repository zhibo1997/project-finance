/**
 * IMPORTANT: 默认不开启运行时 loading 注入，页面多的时候开销比较大，推荐使用 package.json 的 `fl-config.custom-loading` 配置。
 * 注意内部引号都用双引号
 */
export const content_loading = /* html */`
	<span>
		<sl-spinner style="font-size: 42px; --track-width: 4px; --speed: 2.5s; --indicator-color: var(--el-color-primary, #4068d4)"></sl-spinner>
	</span>
`;