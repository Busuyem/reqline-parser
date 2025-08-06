const AppError = require('../errors/app-error');

function safeParse(section, str) {
  try {
    return JSON.parse(str.trim());
  } catch {
    throw new AppError(`Invalid JSON format in ${section} section`, 400);
  }
}

function parse(reqline) {
  if (typeof reqline !== 'string' || !reqline.trim()) {
    throw new AppError('Invalid reqline input. Must be a non-empty string.', 400);
  }

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

      [, method] = tokens;

      if (!['GET', 'POST'].includes(method)) {
        throw new AppError('Invalid HTTP method. Only GET and POST are supported', 400);
      }
    } else if (part.startsWith('URL ')) {
      url = part.substring(4).trim();
    } else if (part.startsWith('HEADERS ')) {
      headers = safeParse('HEADERS', part.substring(8));
    } else if (part.startsWith('QUERY ')) {
      query = safeParse('QUERY', part.substring(6));
    } else if (part.startsWith('BODY ')) {
      body = safeParse('BODY', part.substring(5));
    } else {
      throw new AppError('Invalid or unexpected syntax', 400);
    }
  });

  if (!method) throw new AppError('Missing required HTTP keyword', 400);
  if (!url) throw new AppError('Missing required URL keyword', 400);

  const queryString = Object.keys(query).length
    ? `?${Object.entries(query)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&')}`
    : '';

  const fullUrl = url + queryString;

  return { method, url, headers, query, body, fullUrl };
}

module.exports = { parse };
