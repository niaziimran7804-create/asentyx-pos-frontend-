// Centralized API configuration
const API_TARGET = process.env.API_TARGET || 'http://www.asentyx.com:5000';

// Configurable retry and timeout settings
const DEFAULT_TIMEOUT_MS = parseInt(process.env.PROXY_TIMEOUT_MS || '8000', 10);
const DEFAULT_RETRIES = parseInt(process.env.PROXY_RETRIES || '2', 10);

function normalizeApiPath(rawPath) {
  if (!rawPath) return '';
  // If the client accidentally passed a full URL (including protocol/host), strip it
  try {
    if (/^https?:\/\//i.test(rawPath)) {
      const u = new URL(rawPath);
      return (u.pathname + u.search).replace(/^\//, '');
    }
  } catch (e) {
    // Not a full URL, fallthrough
  }
  return rawPath.replace(/^\//, '');
}

async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS, retries = DEFAULT_RETRIES) {
  let attempt = 0;
  let lastErr = null;

  while (attempt <= retries) {
    attempt += 1;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const resp = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      return resp;
    } catch (err) {
      clearTimeout(timer);
      lastErr = err;
      console.warn(`Proxy fetch attempt ${attempt} failed:`, err && err.message ? err.message : String(err));
      // If aborted due to timeout, mark explicitly
      if (err && err.name === 'AbortError') {
        lastErr = new Error('Request timed out');
      }
      if (attempt > retries) break;
      // Exponential backoff before retrying
      const backoff = 200 * Math.pow(2, attempt);
      await new Promise(r => setTimeout(r, backoff));
    }
  }

  const e = new Error(`All fetch attempts failed: ${lastErr ? lastErr.message : 'unknown error'}`);
  e.cause = lastErr;
  throw e;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { path, ...queryParams } = req.query;
    const rawPath = Array.isArray(path) ? path.join('/') : path || '';
    const apiPath = normalizeApiPath(rawPath);

    // Build query string from remaining query parameters
    const queryString = Object.keys(queryParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
      .join('&');

    // Avoid duplicate /api if API_TARGET already includes it
    const apiPrefix = API_TARGET.replace(/\/+$/, '').endsWith('/api') ? '' : '/api';
    const targetUrl = `${API_TARGET.replace(/\/+$/, '')}${apiPrefix}/${apiPath}${queryString ? `?${queryString}` : ''}`;

    console.log('Proxying request:', {
      method: req.method,
      targetUrl,
      API_TARGET,
      queryParams,
      hasBody: !!req.body,
      bodyType: typeof req.body,
      body: req.body
    });

    // Prepare request options
    const fetchOptions = {
      method: req.method,
      headers: Object.assign(
        { 'Content-Type': 'application/json' },
        req.headers.authorization ? { 'Authorization': req.headers.authorization } : {}
      )
    };

    // Add body for non-GET/HEAD requests
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      console.log('Request body being sent (trimmed):', String(fetchOptions.body).slice(0, 1000));
    }

    console.log('Fetch options (method + headers):', { method: fetchOptions.method, headers: fetchOptions.headers });

    // Execute fetch with timeout and retry
    const response = await fetchWithTimeout(targetUrl, fetchOptions, DEFAULT_TIMEOUT_MS, DEFAULT_RETRIES);

    console.log('Backend response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    const data = await response.text();
    console.log('Backend data:', data);
    
    res.status(response.status);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    
    try {
      res.json(JSON.parse(data));
    } catch {
      res.send(data);
    }
  } catch (error) {
    console.error('Proxy error:', {
      message: error.message,
      stack: error.stack,
      API_TARGET,
      cause: error.cause && (error.cause.message || String(error.cause))
    });

    // If upstream fetch failed due to network/timeout, return 502 Bad Gateway
    const isUpstream = error.message && (error.message.toLowerCase().includes('fetch') || error.message.toLowerCase().includes('timeout'));
    const status = isUpstream ? 502 : 500;

    res.status(status).json({
      error: 'Proxy error',
      message: error.message,
      API_TARGET,
      hint: 'Check if API_TARGET is correct and backend is reachable from Vercel. Ensure backend uses HTTPS in production or use the proxy to avoid mixed-content.'
    });
  }
}
