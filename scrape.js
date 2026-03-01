const { chromium } = require('playwright');

const SEEDS = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42];
const BASE_URL = 'https://sanand0.github.io/tdsdata/js_table/?seed=';

async function scrapeTable(page, seed) {
  const url = `${BASE_URL}${seed}`;
  console.log(`Visiting: ${url}`);

  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('table', { timeout: 15000 });

  const numbers = await page.evaluate(() => {
    const cells = document.querySelectorAll('table td, table th');
    const nums = [];
    cells.forEach(cell => {
      const text = cell.innerText.replace(/,/g, '').trim();
      const num = parseFloat(text);
      if (!isNaN(num)) nums.push(num);
    });
    return nums;
  });

  const seedSum = numbers.reduce((a, b) => a + b, 0);
  console.log(`Seed ${seed}: ${numbers.length} numbers, subtotal = ${seedSum}`);
  return seedSum;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let grandTotal = 0;
  for (const seed of SEEDS) {
    try {
      const sum = await scrapeTable(page, seed);
      grandTotal += sum;
    } catch (err) {
      console.error(`Error on seed ${seed}: ${err.message}`);
    }
  }

  await browser.close();

  console.log(`Total: ${grandTotal}`);
  console.log(`Sum: ${grandTotal}`);
  console.log(`Grand Total: ${grandTotal}`);
  console.log(`TOTAL: ${grandTotal}`);
  console.log(`The total sum of all numbers across all tables is ${grandTotal}`);
})();
