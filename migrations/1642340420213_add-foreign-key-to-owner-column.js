exports.up = (pgm) => {
  pgm.sql(
    "INSERT INTO users(id, username, password, fullname) VALUES ('old_notes', 'old_notes', 'old_notes', 'old notes')",
  );

  pgm.sql("UPDATE notes SET owner = 'old_notes' WHERE owner = null");

  pgm.addConstraint(
    'notes',
    'fk_notes.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES  users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('notes', 'fk_notes.owner_users.id');

  pgm.sql("UPDATE notes SET owner = null WHERE id = 'old_notes'");

  pgm.sql("DELETE from users WHERE id = 'old_notes'");
};
