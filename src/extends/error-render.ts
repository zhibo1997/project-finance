// sl-alert 已经在 main 中引用过了
export const content_error = (error: Error) => {
  return /* html */ `
		<code style="padding: 24px; display: block;">
			<strong>${
        error.message === 'module load rejected'
          ? '模块加载失败，可能是<span style="color: #ff5722;">页面还在构建中</span>，或者页面构建失败，需要确认terminal日志是否存在报错'
          : error.message
      }</strong><br />
			<p>${error.stack?.replace(/\sat/g, '<br/>at')}</p>
		</code>
	`;
};
