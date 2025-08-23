const puppeteer = require("puppeteer");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  // point this to your resume.html file
  const filePath = `file://${path.resolve(__dirname, "resume.html")}`;
  await page.goto(filePath, { waitUntil: "networkidle0" });

  // Measure the height of the rendered content
  const bodyHandle = await page.$("body");
  const boundingBox = await bodyHandle.boundingBox();
  const heightPx = Math.ceil(boundingBox.height);
  await bodyHandle.dispose();

  // Convert px → mm (96px ≈ 25.4mm)
  const heightMm = ((heightPx * 22) / 96).toFixed(2);

  await page.pdf({
    path: 'Divyansh_Rana_Resume.pdf',
    width: '297mm',       // A4 width
    height: `${heightMm}mm`, // dynamic height
    printBackground: true,
  });

  // await page.pdf({
  //   path: "Divyansh_Rana_Resume.pdf",
  //   format: "A3", // 297mm × 420mm
  //   printBackground: true,
  //   height: `${heightMm}mm`, // dynamic height
  //   margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" }, // optional
  //   landscape: false, // set true if you want 420×297mm
  // });
  await browser.close();
  console.log("✅ PDF generated with dynamic height:", heightMm, "mm");
})();
