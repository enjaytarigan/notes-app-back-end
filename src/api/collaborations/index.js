const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  version: '1.0.0',
  name: 'collaborations',
  register: (server, { collaborationsService, notesService, validator }) => {
    const collaborationsHandler = new CollaborationsHandler(
      collaborationsService, notesService, validator,
    );

    server.route(routes(collaborationsHandler));
  },
};
