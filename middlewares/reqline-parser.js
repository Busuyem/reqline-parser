const { parse } = require('../core/reqline/parser');

module.exports = {
  handler: async (requestComponents) => {
    const body = requestComponents?.body ?? {};
    const { reqline } = body;

    console.log('🟡 Middleware received body:', body);
    console.log('🟡 Extracted reqline:', reqline, 'typeof:', typeof reqline);

    if (typeof reqline !== 'string' || !reqline.trim()) {
      return {
        status: 400,
        data: {
          error: true,
          message: 'Missing or invalid reqline field (must be a non-empty string)',
        },
        endHandlerChain: true,
      };
    }

    try {
      const parsed = parse(reqline.trim());
      console.log('Parser output:', parsed);

      return {
        augments: {
          body: {
            parsedReqline: parsed,
          },
        },
      };
    } catch (error) {
      console.error('Parser failed:', error.message);

      return {
        status: 400,
        data: {
          error: true,
          message: error.message || 'Invalid reqline format',
        },
        endHandlerChain: true,
      };
    }
  },
};
