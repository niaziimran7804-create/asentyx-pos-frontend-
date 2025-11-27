// Centralized API configuration
const API_TARGET = process.env.API_TARGET || 'http://asentyx.com:5000';

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
    const { path } = req.query;
    const apiPath = Array.isArray(path) ? path.join('/') : path;
    const targetUrl = `${API_TARGET}/api/${apiPath}`;

    console.log('Proxying request:', {
      method: req.method,
      targetUrl,
      hasBody: !!req.body,
      bodyType: typeof req.body,
      body: req.body
    });

    // Prepare request options
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && { 'Authorization': req.headers.authorization })
      }
    };

    // Add body for non-GET/HEAD requests
    // In Vercel, req.body is already parsed as JSON object
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      console.log('Request body being sent:', fetchOptions.body);
    }

    console.log('Fetch options:', fetchOptions);

    const response = await fetch(targetUrl, fetchOptions);

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
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy error', message: error.message, stack: error.stack });
  }
}
