import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const directory = resolve(process.env.SERVE_DIR || 'dist');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain' };
const prefix = process.env.SERVE_PREFIX || '/';
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (!pathname.startsWith(prefix)) { res.writeHead(404); res.end('Not found'); return; }
    let target = resolve(directory, '.' + '/' + pathname.slice(prefix.length));
    if (target !== directory && !target.startsWith(directory + sep)) { res.writeHead(403); res.end(); return; }
    const info = await stat(target);
    if (info.isDirectory()) {
      if (!pathname.endsWith('/')) { res.writeHead(301, { Location: pathname + '/' }); res.end(); return; }
      target = resolve(target, 'index.html');
    }
    const body = await readFile(target);
    res.writeHead(200, { 'Content-Type': types[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch { res.writeHead(404, { 'Content-Type': 'text/html' }); res.end(await readFile(resolve(directory, '404.html')).catch(() => 'Not found')); }
}).listen(port, '127.0.0.1', () => console.log(`Tank Volume Lab preview: http://localhost:${port}${prefix}`));
