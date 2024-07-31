const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto("https://niggerbase.xyz");

    await page.click('span:contains("Email")');
    await page.type('#query', email);
    await page.click('button[type="submit"]');

    await page.waitForSelector('#results', { timeout: 30000 });
    
    await page.waitForTimeout(5000);

    const content = await page.evaluate(() => document.body.innerText);
    const contentLines = content.split('\n');
    const trimmedContent = contentLines.slice(10).join('\n');

    res.status(200).json({ result: trimmedContent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during the search' });
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
