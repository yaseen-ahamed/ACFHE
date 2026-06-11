const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicHtml = path.join(__dirname, 'public_html');
const inputFile = path.join(publicHtml, 'assets', 'ACFHE Logomark.jpg');
const pngFile = path.join(publicHtml, 'favicon.png');
const icoFile = path.join(publicHtml, 'favicon.ico');
const appleIcon = path.join(publicHtml, 'apple-touch-icon.png');

async function main() {
    console.log("Generating standard favicons...");
    // Generate 48x48 PNG (Standard for SERP and modern browsers)
    await sharp(inputFile).resize(48, 48).png().toFile(pngFile);
    // Generate 180x180 for Apple touch icon (helps SERP too sometimes)
    await sharp(inputFile).resize(180, 180).png().toFile(appleIcon);
    // Generate 32x32 ICO
    // sharp doesn't natively do ICO, so we'll just save it as PNG but name it .ico for basic fallback
    await sharp(inputFile).resize(32, 32).png().toFile(icoFile);

    console.log("Favicons generated.");

    // Update index.html
    const indexHtmlPath = path.join(publicHtml, 'index.html');
    let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

    // Remove the old jpeg favicon link
    const oldFavicon = '<link rel="icon" type="image/jpeg" href="/assets/ACFHE%20Logomark.jpg" />';
    if (htmlContent.includes(oldFavicon)) {
        htmlContent = htmlContent.replace(oldFavicon, '');
    }

    // Insert the new complete favicon tags right before </head>
    const newTags = `
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  </head>`;
    
    htmlContent = htmlContent.replace('</head>', newTags);
    fs.writeFileSync(indexHtmlPath, htmlContent, 'utf8');
    console.log("Updated index.html with standard favicon links.");
}

main().catch(console.error);
