const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicHtml = path.join(__dirname, 'public_html');
const inputFile = path.join(publicHtml, 'assets', 'ACFHE Logomark.jpg');
const outputFile = path.join(publicHtml, 'favicon.png');

async function main() {
    // Generate favicon
    console.log("Generating favicon...");
    await sharp(inputFile)
        .resize(64, 64)
        .png()
        .toFile(outputFile);
    console.log("Favicon generated.");

    // Update index.html
    const indexHtmlPath = path.join(publicHtml, 'index.html');
    let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

    if (!htmlContent.includes('rel="icon"')) {
        htmlContent = htmlContent.replace('</head>', '    <link rel="icon" type="image/png" href="/favicon.png" />\n  </head>');
        fs.writeFileSync(indexHtmlPath, htmlContent, 'utf8');
        console.log("Updated index.html with favicon link.");
    } else {
        console.log("index.html already has a favicon link.");
    }
}

main().catch(console.error);
