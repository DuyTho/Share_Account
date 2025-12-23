import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import path from 'path';

puppeteer.use(StealthPlugin());

const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const inviteToFamily = async (customerEmail: string) => {
  console.log(`🤖 [BOT START] Mời thành viên: ${customerEmail}`);

  const userDataDir = path.resolve(__dirname, '../../bot_profile');
  const executablePath =
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

  const browser = await puppeteer.launch({
    headless: false,
    executablePath,
    userDataDir,
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1280,800',
    ],
  });

  const page = await browser.newPage();

  try {
    /* ================= STEP 0 ================= */
    console.log('🌏 Truy cập families.google.com...');
    await page.goto('https://families.google.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    await sleep(6000);

    /* ================= STEP 1 ================= */
    console.log('🔍 Click "Gửi lời mời"...');

    await page.waitForFunction(() =>
      document.body.innerText.includes('Gửi lời mời')
    );

    await page.evaluate(() => {
      const btn = Array.from(
        document.querySelectorAll('a, button')
      ).find(el =>
        (el as HTMLElement).innerText?.includes('Gửi lời mời')
      );

      if (!btn) throw new Error('Không tìm thấy nút Gửi lời mời');
      btn.scrollIntoView({ block: 'center' });
      (btn as HTMLElement).click();
    });

    await sleep(3000);

    /* ================= STEP 2 ================= */
    console.log('✍️ Click & nhập email...');

    // Find + focus input (Shadow DOM safe)
    await page.evaluate(() => {
      function findInput(root: ParentNode): HTMLInputElement | null {
        const inputs = root.querySelectorAll?.('input') || [];
        for (const i of Array.from(inputs)) {
          const label = i.getAttribute('aria-label') || '';
          const placeholder = i.getAttribute('placeholder') || '';
          if (
            label.includes('email') ||
            placeholder.includes('email')
          ) {
            return i as HTMLInputElement;
          }
        }

        const all = root.querySelectorAll?.('*') || [];
        for (const el of Array.from(all)) {
          const shadow = (el as any).shadowRoot;
          if (shadow) {
            const found = findInput(shadow);
            if (found) return found;
          }
        }
        return null;
      }

      const input = findInput(document);
      if (!input) throw new Error('Không tìm thấy ô nhập email');

      input.scrollIntoView({ block: 'center' });
      input.click();
      input.focus();
    });

    await sleep(800);

    // Type email chậm
    for (const char of customerEmail) {
      await page.keyboard.type(char);
      await sleep(80);
    }

    await sleep(1000);

    // Enter để tạo CHIP
    await page.keyboard.press('Enter');

    /* ================= STEP 3 ================= */
    console.log('⌛ Chờ Google render chip email...');

    await page.waitForFunction(
      (email) => {
        return Array.from(document.querySelectorAll('*')).some(
          el => (el as HTMLElement).innerText?.includes(email)
        );
      },
      { timeout: 15000 },
      customerEmail
    );

    console.log('✅ Email đã được Google nhận');


    /* ================= STEP 4 ================= */
    console.log('🚀 Click nút Gửi...');

    await page.waitForFunction(() => {
      const btn = Array.from(
        document.querySelectorAll('a, button')
      ).find(el =>
        (el as HTMLElement).innerText?.trim() === 'Gửi'
      );
      return !!btn;
    });

    await page.evaluate(() => {
      const btn = Array.from(
        document.querySelectorAll('a, button')
      ).find(el =>
        (el as HTMLElement).innerText?.trim() === 'Gửi'
      );

      if (!btn) throw new Error('Không tìm thấy nút Gửi');
      btn.scrollIntoView({ block: 'center' });
      (btn as HTMLElement).click();
    });

    console.log('🎉 Gửi lời mời thành công');

  } catch (err: any) {
    console.error('❌ [BOT ERROR]', err.message);
    await page.screenshot({
      path: `error-${Date.now()}.png`,
      fullPage: true,
    });
  } finally {
    console.log('🤖 Đóng browser sau 5s...');
    setTimeout(() => browser.close(), 5000);
  }
};
