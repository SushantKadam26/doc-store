import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5173;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.prover': 'application/octet-stream',
  '.verifier': 'application/octet-stream',
  '.zkir': 'application/octet-stream',
  '.bzkir': 'application/octet-stream',
};

async function proxyRequest(targetUrl, req, res) {
  try {
    const url = new URL(targetUrl);
    const options = {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'Accept': req.headers['accept'] || 'application/json',
      },
    };

    let body = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      body = Buffer.concat(chunks);
    }

    const response = await fetch(url.toString(), {
      ...options,
      body: body ? body : undefined,
    });

    res.writeHead(response.status, {
      'Content-Type': response.headers.get('content-type') || 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
      'Access-Control-Allow-Headers': '*',
    });

    const resBuffer = await response.arrayBuffer();
    res.end(Buffer.from(resBuffer));
  } catch (err) {
    res.writeHead(502, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify({ error: 'Proxy request failed', details: String(err) }));
  }
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
      'Access-Control-Allow-Headers': '*',
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = parsedUrl.pathname;

  // Proxy to Midnight Indexer GraphQL
  if (pathname === '/api/graphql' || pathname.startsWith('/api/graphql/')) {
    const targetIndexer = process.env.INDEXER_URL || 'http://127.0.0.1:8088/api/v4/graphql';
    await proxyRequest(targetIndexer, req, res);
    return;
  }

  // Proxy to Midnight Proof Server
  if (pathname === '/api/proof' || pathname.startsWith('/api/proof/')) {
    const targetProofServer = process.env.PROOF_SERVER_URL || 'http://127.0.0.1:6300';
    const subpath = pathname.replace(/^\/api\/proof/, '');
    await proxyRequest(`${targetProofServer}${subpath}`, req, res);
    return;
  }

  // Health check endpoint
  if (pathname === '/api/health') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    let indexerUp = false;
    let proofServerUp = false;
    let blockHeight = 0;

    try {
      const idxRes = await fetch('http://127.0.0.1:8088/api/v4/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: '{ blocks(first: 1, orderBy: [HEIGHT_DESC]) { nodes { height } } }',
        }),
        signal: AbortSignal.timeout(2000),
      });
      if (idxRes.ok) {
        indexerUp = true;
        const data = await idxRes.json();
        blockHeight = data.data?.blocks?.nodes?.[0]?.height || 0;
      }
    } catch {
      indexerUp = false;
    }

    try {
      const proofRes = await fetch('http://127.0.0.1:6300', {
        signal: AbortSignal.timeout(2000),
      });
      proofServerUp = proofRes.status < 500;
    } catch {
      proofServerUp = false;
    }

    let midnightState = null;
    try {
      const stateFile = path.resolve(__dirname, '.midnight-state.json');
      if (fs.existsSync(stateFile)) {
        midnightState = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
      }
    } catch {}

    res.end(
      JSON.stringify({
        status: 'ok',
        node: { online: indexerUp, blockHeight },
        indexer: { online: indexerUp, url: 'http://127.0.0.1:8088' },
        proofServer: { online: proofServerUp, url: 'http://127.0.0.1:6300' },
        midnightState,
      })
    );
    return;
  }

  // Static File Serving
  let filePath = '';

  if (pathname.startsWith('/contracts/')) {
    filePath = path.resolve(__dirname, pathname.substring(1));
  } else if (pathname === '/' || pathname === '/index.html') {
    filePath = path.resolve(__dirname, 'public', 'index.html');
  } else {
    filePath = path.resolve(__dirname, 'public', pathname.substring(1));
    if (!fs.existsSync(filePath)) {
      // Fallback to root files or index.html for SPA
      const rootCandidate = path.resolve(__dirname, pathname.substring(1));
      if (fs.existsSync(rootCandidate) && fs.statSync(rootCandidate).isFile()) {
        filePath = rootCandidate;
      } else {
        filePath = path.resolve(__dirname, 'public', 'index.html');
      }
    }
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

function startServer(port) {
  server.listen(port, '127.0.0.1', () => {
    console.log(`\n=============================================================`);
    console.log(`  🚀 DocStore Web Server running for Chrome & 1AM Wallet`);
    console.log(`  👉 URL: http://127.0.0.1:${port}`);
    console.log(`  🔗 Docker Devnet: Indexer (8088), Proof Server (6300), Node (9944)`);
    console.log(`=============================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT || 3000);
