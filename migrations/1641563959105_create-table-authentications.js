/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('authentications', {
    token: {
      notNull: true,
      type: 'TEXT',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('authentications');
};
