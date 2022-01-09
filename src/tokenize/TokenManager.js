const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const { ACCESS_TOKEN, REFRESH_TOKEN } = process.env;
const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, ACCESS_TOKEN),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, REFRESH_TOKEN),
  verifyRefreshToken: (token) => {
    try {
      const artifacts = Jwt.token.decode(token);
      Jwt.token.verifySignature(artifacts, REFRESH_TOKEN);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;
