// core/middlewares/reqline-parser.js
const { parse } = require('../reqline/parser');

module.exports = {
  handler: async (requestComponents) => {
    const { reqline } = requestComponents.body || {};

    if (!reqline) {
      return {
        status: 400,
        data: {
          error: true,
          message: 'Missing reqline field',
        },
        endHandlerChain: true,
      };
    }

    try {
      const parsed = parse(reqline);

      return {
        augments: {
          body: {
            parsedReqline: parsed,
          },
        },
      };
    } catch (error) {
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
