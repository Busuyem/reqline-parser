const axios = require('axios');
const { parse } = require('./parser');
const AppError = require('../errors/app-error');

exports.execute = async (reqline) => {
  const parsed = parse(reqline);
  const { method, url, query, body, headers, full_url } = parsed;

  const requestStart = Date.now();
  try {
    const response = await axios({
      method: method.toLowerCase(),
      url: full_url,
      headers,
      data: body,
    });

    const requestStop = Date.now();

    return {
      request: {
        query,
        body,
        headers,
        full_url,
      },
      response: {
        http_status: response.status,
        duration: requestStop - requestStart,
        request_start_timestamp: requestStart,
        request_stop_timestamp: requestStop,
        response_data: response.data,
      },
    };
  } catch (err) {
    throw new AppError(
      err.response ? `Request failed with status ${err.response.status}` : 'Request error',
      400
    );
  }
};
