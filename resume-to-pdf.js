const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // point this to your resume.html file
  const filePath = `file://${path.resolve(__dirname, 'resume.html')}`;
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  // Measure the height of the rendered content
  const bodyHandle = await page.$('body');
  const boundingBox = await bodyHandle.boundingBox();
  const heightPx = Math.ceil(boundingBox.height);
  await bodyHandle.dispose();

  // Convert px → mm (96px ≈ 25.4mm)
  const heightMm = (heightPx * 30.4 / 96).toFixed(2);

  await page.pdf({
    path: 'Divyansh_Rana_Resume.pdf',
    width: '210mm',       // A4 width
    height: `${heightMm}mm`, // dynamic height
    printBackground: true,
  });

  await browser.close();
  console.log("✅ PDF generated with dynamic height:", heightMm, "mm");
})();