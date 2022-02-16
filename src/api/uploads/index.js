const UploadsHandler = require('./handler');
const routes = require('./route');

module.exports = {
  version: '1.0.0',
  name: 'uploads',
  register: async (server, { service, validator }) => {
    const uploadsHandler = new UploadsHandler(service, validator);

    server.route(routes(uploadsHandler));
  },
};
