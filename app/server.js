const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = Number(process.env.PORT || 8080);
const version = process.env.APP_VERSION || 'local';
const startedAt = new Date().toISOString();
const requestCounts = new Map();

function recordRequest(route, status) {
  const key = `${route}|${status}`;
  requestCounts.set(key, (requestCounts.get(key) || 0) + 1);
}

function respond(response, statusCode, body, headers = {}) {
  response.writeHead(statusCode, { 'content-type': 'application/json', ...headers });
  response.end(typeof body === 'string' ? body : JSON.stringify(body));
}

function requestHandler(request, response) {
  if (request.url === '/') {
    recordRequest('root', 200);
    const page = fs.readFileSync(path.join(__dirname, 'index.html'));
    return respond(response, 200, page, { 'content-type': 'text/html; charset=utf-8' });
  }

  if (request.url === '/api/status') {
    recordRequest('api/status', 200);
    return respond(response, 200, {
      service: 'gitops-progressive-delivery-demo',
      version,
      startedAt,
      status: 'healthy'
    });
  }

  if (request.url === '/healthz') {
    recordRequest('healthz', 200);
    return respond(response, 200, { status: 'ok', version });
  }

  if (request.url === '/readyz') {
    recordRequest('readyz', 200);
    return respond(response, 200, { status: 'ready', version });
  }

  if (request.url === '/metrics') {
    const metrics = [...requestCounts.entries()].map(([key, count]) => {
      const [route, status] = key.split('|');
      return `http_requests_total{route="${route}",status="${status}"} ${count}`;
    });
    const body = [
      '# HELP http_requests_total Total HTTP requests handled',
      '# TYPE http_requests_total counter',
      ...metrics,
      ''
    ].join('\n');
    return respond(response, 200, body, { 'content-type': 'text/plain; version=0.0.4' });
  }

  recordRequest('not_found', 404);
  return respond(response, 404, { error: 'not_found' });
}

if (require.main === module) {
  const server = http.createServer(requestHandler);
  server.listen(port, '0.0.0.0', () => {
    console.log(`server listening on ${port} (${version})`);
  });

  function shutdown() {
    server.close(() => process.exit(0));
  }

  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
}

module.exports = { requestHandler };
