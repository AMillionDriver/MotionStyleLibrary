import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const portArgumentIndex = process.argv.indexOf('--port');
const port = Number(portArgumentIndex >= 0 ? process.argv[portArgumentIndex + 1] : 4174);
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function resolveRequestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
  let filePath = resolve(repositoryDirectory, `.${pathname}`);
  const repositoryPrefix = `${repositoryDirectory}${sep}`;

  if (filePath !== repositoryDirectory && !filePath.startsWith(repositoryPrefix)) {
    return null;
  }

  try {
    if (statSync(filePath).isDirectory()) filePath = resolve(filePath, 'index.html');
    if (!statSync(filePath).isFile()) return null;
    return filePath;
  } catch {
    return null;
  }
}

export function startStaticServer({
  host = '127.0.0.1',
  port: serverPort = port,
  quiet = false,
} = {}) {
  const server = createServer((request, response) => {
    if (new URL(request.url || '/', 'http://localhost').pathname === '/favicon.ico') {
      response.writeHead(204);
      response.end();
      return;
    }

    const filePath = resolveRequestPath(request.url || '/');
    if (!filePath) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': mimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream',
    });
    createReadStream(filePath).pipe(response);
  });

  return new Promise((resolveServer, reject) => {
    server.once('error', reject);
    server.listen(serverPort, host, () => {
      server.removeListener('error', reject);
      if (!quiet) {
        console.log(`Axoloth static server listening on http://${host}:${serverPort}`);
      }
      resolveServer(server);
    });
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = await startStaticServer();
  const closeServer = () => server.close(() => process.exit(0));
  process.on('SIGINT', closeServer);
  process.on('SIGTERM', closeServer);
}
