const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'export',
  version: '1.0.0',
  register: async (server, { producerService, validator }) => {
    const exportsHandler = new ExportsHandler(producerService, validator);

    await server.route(routes(exportsHandler));
  },
};
