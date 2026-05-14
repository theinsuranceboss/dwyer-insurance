import https from 'https';

const siteId = 'bcfe7709-518a-48f1-8dad-0fc3458c8b32'; // New site ID
const token = 'nfp_PsYPEuBVU1zxgrDnd9LS17nd9VLNHP515dea';

const options = {
  hostname: 'api.netlify.com',
  port: 443,
  path: `/api/v1/sites/${siteId}`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let body = '';
  res.on('data', (d) => {
    body += d;
  });
  res.on('end', () => {
    const data = JSON.parse(body);
    console.log(`Site State: ${data.state}`);
    console.log(`Published Deploy:`, data.published_deploy ? data.published_deploy.id : 'None');
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.end();
