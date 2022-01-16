exports.up = (pgm) => {
  pgm.addColumn('notes', {
    owner: 'VARCHAR(50)',
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('notes', 'owner');
};
