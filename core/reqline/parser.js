const AppError = require('../errors/app-error');

function parse(reqline) {
  if (!reqline) {
    throw new AppError('Missing reqline input', 400);
  }

  // Split parts by pipe delimiter
  const parts = reqline.split('|').map((p) => p.trim());

  let method;
  let url;
  let headers = {};
  let query = {};
  let body = {};

  parts.forEach((part) => {
    if (part.startsWith('HTTP ')) {
      const tokens = part.split(' ');
      if (tokens.length < 2) {
        throw new AppError('Missing required HTTP keyword', 400);
      }
      method = tokens[1];
      if (!['GET', 'POST'].includes(method)) {
        throw new AppError('Invalid HTTP method. Only GET and POST are supported', 400);
      }
    } else if (part.startsWith('URL ')) {
      url = part.substring(4).trim();
    } else if (part.startsWith('HEADERS ')) {
      try {
        headers = JSON.parse(part.substring(8).trim());
      } catch {
        throw new AppError('Invalid JSON format in HEADERS section', 400);
      }
    } else if (part.startsWith('QUERY ')) {
      try {
        query = JSON.parse(part.substring(6).trim());
      } catch {
        throw new AppError('Invalid JSON format in QUERY section', 400);
      }
    } else if (part.startsWith('BODY ')) {
      try {
        body = JSON.parse(part.substring(5).trim());
      } catch {
        throw new AppError('Invalid JSON format in BODY section', 400);
      }
    } else {
      throw new AppError('Invalid or unexpected syntax', 400);
    }
  });

  if (!method) throw new AppError('Missing required HTTP keyword', 400);
  if (!url) throw new AppError('Missing required URL keyword', 400);

  // Build full URL with query
  const queryString = Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : '';
  const fullUrl = url + queryString;

  return { method, url, headers, query, body, full_url: fullUrl };
}

module.exports = { parse };
