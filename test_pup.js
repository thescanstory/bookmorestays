const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Spoof user agent to avoid bot blocks
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  await page.goto('https://www.instagram.com/reel/DajyFOri7MV/', { waitUntil: 'networkidle2' });
  
  try {
    // Try to find the title tag which usually contains the caption snippet
    const title = await page.title();
    console.log("Title:", title);
    
    // Try to find meta description
    const metaDesc = await page.$eval('meta[property="og:description"]', el => el.content).catch(() => null);
    console.log("Meta Desc:", metaDesc);
    
    const metaTitle = await page.$eval('meta[property="og:title"]', el => el.content).catch(() => null);
    console.log("Meta Title:", metaTitle);
    
  } catch(e) {
    console.log("Error", e);
  }
  
  await browser.close();
})();
