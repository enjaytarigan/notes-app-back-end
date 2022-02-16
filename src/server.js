require('dotenv').config();

const Jwt = require('@hapi/jwt');
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const authentications = require('./api/authentications');
const notes = require('./api/notes');
const users = require('./api/users');
const _exports = require('./api/exports');
const uploads = require('./api/uploads');

const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const NotesService = require('./services/postgres/NotesService');
const UsersService = require('./services/postgres/UsersService');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const StorageService = require('./services/S3/StorageService');
const ProducerService = require('./services/rabbitmq/ProducerService');
const AutheneticationsValidator = require('./validator/authentications');
const NotesValidator = require('./validator/notes');
const UsersValidator = require('./validator/users');
const TokenManager = require('./tokenize/TokenManager');
const collaborations = require('./api/collaborations');
const CollaborationsValidator = require('./validator/collaborations');
const UploadsValidator = require('./validator/uploads');
const ExportsValidator = require('./validator/exports');

const init = async () => {
  const collaborationsService = new CollaborationsService();
  const notesService = new NotesService(collaborationsService);
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const storageService = new StorageService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  await server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: notes,
      options: { service: notesService, validator: NotesValidator },
    },
    {
      plugin: users,
      options: { service: usersService, validator: UsersValidator },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AutheneticationsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        notesService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        producerService: ProducerService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server running in ${server.info.uri}`);
};

init();
