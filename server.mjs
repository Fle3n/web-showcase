import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8' };
const servers = [];
for (const [site, port] of [['coffee',1051], ['clinic',1052], ['flow',1053]]) {
  const server = http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'self'");
    if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405, {'Allow':'GET, HEAD'}); res.end('Method not allowed'); return; }
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      let relative;
      if (pathname.startsWith('/assets/')) relative = pathname.slice(1);
      else relative = `${site}/${pathname === '/' ? 'index.html' : pathname.slice(1)}`;
      const full = path.resolve(root, relative);
      const allowed = [path.join(root,site)+path.sep, path.join(root,'assets')+path.sep];
      if (!allowed.some(prefix => full.startsWith(prefix)) || !mime[path.extname(full)] || !(await stat(full)).isFile()) throw new Error('not found');
      const data = await readFile(full);
      res.writeHead(200, {'Content-Type':mime[path.extname(full)], 'Cache-Control':'no-cache'});
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch { res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); res.end('Страница не найдена'); }
  });
  server.on('error', error => { console.error(`${site} : ${error.message}`); for (const running of servers) running.close(); process.exitCode = 1; });
  server.listen(port, '0.0.0.0', () => console.log(`${site}: http://localhost:${port} (0.0.0.0)`));
  servers.push(server);
}
for (const signal of ['SIGINT','SIGTERM']) process.on(signal, () => { for (const server of servers) server.close(); });
