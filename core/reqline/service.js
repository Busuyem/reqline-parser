const axios = require('axios');
const AppError = require('../errors/app-error');

exports.execute = async (parsedReqline) => {
  if (!parsedReqline || typeof parsedReqline !== 'object') {
    throw new AppError('Service requires parsedReqline object', 400);
  }

  const { method, query, body, headers, fullUrl } = parsedReqline;

  const requestStart = Date.now();
  try {
    const response = await axios({
      method: method.toLowerCase(),
      url: fullUrl,
      headers,
      data: body,
    });

    const requestStop = Date.now();

    return {
      request: {
        query,
        body,
        headers,
        fullUrl,
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
