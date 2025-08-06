const reqlineService = require('../core/reqline/service');
const reqlineParser = require('../middlewares/reqline-parser');

module.exports = {
  path: '/',
  method: 'post',
  middlewares: [reqlineParser],
  handler: async (requestComponents) => {
    try {
      const { parsedReqline } = requestComponents.body;

      const result = await reqlineService.execute(parsedReqline);

      return {
        status: 200,
        data: result,
      };
    } catch (error) {
      return {
        status: error.statusCode || 400,
        data: {
          error: true,
          message: error.message || 'An error occurred',
        },
      };
    }
  },
};
