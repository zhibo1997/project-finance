import puppeteer from 'puppeteer';

(async () => {
  try {
    console.log('启动浏览器...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    console.log('访问项目列表页面...');
    await page.goto('http://localhost:3001/projects', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    console.log('页面标题:', await page.title());

    console.log('\n页面包含的 Tailwind CSS 类:');
    const tailwindClasses = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const classes = new Set();

      elements.forEach(el => {
        if (el.className && typeof el.className === 'string') {
          el.className.split(' ').forEach(cls => {
            if (cls && (cls.startsWith('bg-') || cls.startsWith('text-') ||
                cls.startsWith('px-') || cls.startsWith('py-') ||
                cls.startsWith('flex'))) {
              classes.add(cls);
            }
          });
        }
      });

      return Array.from(classes).sort();
    });

    tailwindClasses.forEach(cls => console.log(`- ${cls}`));

    console.log(`\n共找到 ${tailwindClasses.length} 个 Tailwind CSS 类`);

    await browser.close();
    console.log('\n检查完成');
  } catch (error) {
    console.error('错误:', error);
  }
})();
