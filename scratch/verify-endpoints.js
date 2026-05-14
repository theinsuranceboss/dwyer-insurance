const https = require('https');

const fetchEndpoint = (name, url) => new Promise((resolve) => {
  https.get(url, (res) => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log(`[${name}] Status: ${res.statusCode} | Success: ${data.success || !data.error}`);
        if (data.error) console.log(`[${name}] ERROR: ${data.error}`);
      } catch(e) {
        console.log(`[${name}] Status: ${res.statusCode} | Parse Error: ${e.message}`);
      }
      resolve();
    });
  }).on('error', e => {
    console.log(`[${name}] Network Error: ${e.message}`);
    resolve();
  });
});

async function run() {
  await fetchEndpoint('Vercel test-db', 'https://dwyer-insurance.vercel.app/api/test-db');
  await fetchEndpoint('Vercel site-data', 'https://dwyer-insurance.vercel.app/api/site-data');
  await fetchEndpoint('Netlify test-db', 'https://dwyer-insurance-group-official.netlify.app/api/test-db');
  await fetchEndpoint('Netlify site-data', 'https://dwyer-insurance-group-official.netlify.app/api/site-data');
}
run();
