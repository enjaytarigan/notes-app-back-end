const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(producerService, validator) {
    this._producerService = producerService;
    this._validator = validator;
    this.postExportNotesHandler = this.postExportNotesHandler.bind(this);
  }

  async postExportNotesHandler(request, h) {
    try {
      this._validator.validateExportNotesPayload(request.payload);

      const message = {
        userId: request.auth.credentials.id,
        targetEmail: request.payload.targetEmail,
      };

      await this._producerService.sendMessage(
        'export:notes',
        JSON.stringify(message),
      );

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
      });

      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Internal Server Error',
      });
      response.code(500);
      return response;
    }
  }
}

module.exports = ExportsHandler;
