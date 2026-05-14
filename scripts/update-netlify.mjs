import https from 'https';

const siteId = '4167f27a-5a25-46e6-8119-549a236914be';
const token = 'nfp_PsYPEuBVU1zxgrDnd9LS17nd9VLNHP515dea';

const data = JSON.stringify({
  build_settings: {
    provider: null,
    repo_url: null,
    repo_branch: null,
    cmd: '',
    dir: '.next'
  }
});

const options = {
  hostname: 'api.netlify.com',
  port: 443,
  path: `/api/v1/sites/${siteId}`,
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write(data);
req.end();
