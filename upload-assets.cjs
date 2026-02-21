const fs = require('fs');
const path = require('path');
const https = require('https');

const dotenv = fs.readFileSync('.env', 'utf8');
const IMGBB_API_KEY = dotenv.match(/VITE_IMGBB_API_KEY=(.*)/)[1].trim().replace(/['"]/g, '');

const assetsDir = path.join(__dirname, 'src', 'assets');
const filesToUpload = [
    'GlowSun-1837.png',
    'GlowSun 160.png',
    'IntelliSun-512.png',
    'IntelliSun-1004.png',
    'IntelliSun-5120.png'
];

async function uploadImage(fileName) {
    const filePath = path.join(assetsDir, fileName);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return null;
    }

    const image = fs.readFileSync(filePath);
    const base64Image = image.toString('base64');

    const postData = `image=${encodeURIComponent(base64Image)}`;

    const options = {
        hostname: 'api.imgbb.com',
        path: `/1/upload?key=${IMGBB_API_KEY}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.success) {
                        resolve(response.data.url);
                    } else {
                        reject(response.error);
                    }
                } catch (e) {
                    reject(new Error(`Failed to parse response: ${data}`));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
    });
}

async function run() {
    const urls = {};
    for (const file of filesToUpload) {
        console.log(`Uploading ${file}...`);
        try {
            const url = await uploadImage(file);
            urls[file] = url;
            console.log(`Uploaded ${file}: ${url}`);
        } catch (err) {
            console.error(`Failed to upload ${file}:`, err);
        }
    }
    fs.writeFileSync('uploaded_urls.json', JSON.stringify(urls, null, 2));
    console.log('Uploads complete. saved to uploaded_urls.json');
}

run();
