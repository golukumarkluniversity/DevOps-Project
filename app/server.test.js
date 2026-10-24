const assert = require('node:assert/strict');
const test = require('node:test');
const http = require('node:http');
const { requestHandler } = require('./server');

function request(path) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(requestHandler);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      http.get(`http://127.0.0.1:${port}${path}`, (response) => {
        let body = '';
        response.on('data', (chunk) => { body += chunk; });
        response.on('end', () => {
          server.close();
          resolve({ statusCode: response.statusCode, body });
        });
      }).on('error', (error) => {
        server.close();
        reject(error);
      });
    });
  });
}

test('health endpoint reports a healthy service', async () => {
  const response = await request('/healthz');
  assert.equal(response.statusCode, 200);
  assert.equal(JSON.parse(response.body).status, 'ok');
});

test('metrics include successful requests', async () => {
  await request('/healthz');
  const response = await request('/metrics');
  assert.equal(response.statusCode, 200);
  assert.match(response.body, /http_requests_total.*status="200"/);
});

test('unknown routes return a not found response', async () => {
  const response = await request('/missing');
  assert.equal(response.statusCode, 404);
  assert.equal(JSON.parse(response.body).error, 'not_found');
});
