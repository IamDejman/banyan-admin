const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT, 10) || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      // CORS configuration
      const origin = req.headers.origin;
      const allowedOrigins = [
        'https://banyan-admin-six.vercel.app',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
      ];

      // Add custom origins from environment
      if (process.env.ALLOWED_ORIGINS) {
        allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(','));
      }

      const isAllowedOrigin = origin && allowedOrigins.includes(origin);

      // Set CORS headers
      if (isAllowedOrigin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      } else if (pathname.startsWith('/api/')) {
        // Block unauthorized cross-origin API requests
        if (req.method !== 'GET') {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'Unauthorized cross-origin request',
            message: 'CORS policy violation' 
          }));
          return;
        }
      }

      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Max-Age', '86400');

      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      // Security headers
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()');
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
      
      // Content Security Policy (secure - no unsafe-inline/unsafe-eval in production; allow specific inline scripts via hashes)
      const isDev = process.env.NODE_ENV !== 'production';
      const cspHeader = isDev
        ? "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; img-src 'self' data: blob: https: http:; font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; connect-src 'self' https://api.banyanclaims.com https://banyan.backend.ricive.com wss: ws:; media-src 'self'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; manifest-src 'self'; worker-src 'self' blob:; child-src 'self' blob:"
        : "default-src 'self'; script-src 'self' 'strict-dynamic' https://cdn.jsdelivr.net https://unpkg.com 'sha256-OBTN3RiyCV4Bq7dFqZ5a2pAXjnCcCYeTJMO2I/LYKeo=' 'sha256-Q/ZSkqA9m4j3jRW7iqIpyUAaoSHu6mzxX0IHdNGmTaY=' 'sha256-J8bSn6lu10bLZU5fvLCoJLfGVequTEB6hA+c6vHQFJc=' 'sha256-E7rC4mqDTMqvvA3OJF3uSPVwnekVy5o+uXPcIZzl1k4=' 'sha256-/Imymk8LRsPN4Ex80id7QPlAeu2LQGntk3kvJZ4xDec='; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; connect-src 'self' https://api.banyanclaims.com https://banyan.backend.ricive.com wss: ws:; media-src 'self'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; manifest-src 'self'; worker-src 'self' blob:; child-src 'self' blob:; upgrade-insecure-requests; block-all-mixed-content; report-uri /api/csp-report";
      
      res.setHeader('Content-Security-Policy', cspHeader);
      
      // Force HTTPS in production
      if (!dev && req.headers['x-forwarded-proto'] !== 'https') {
        res.writeHead(301, {
          Location: `https://${req.headers.host}${req.url}`
        });
        res.end();
        return;
      }

      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
  .once('error', (err) => {
    console.error(err);
    process.exit(1);
  })
  .listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
