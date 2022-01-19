exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      primaryKey: true,
      type: 'VARCHAR(50)',
    },
    note_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'collaborations',
    'unique_note_id_and_user_id',
    'UNIQUE(note_id, user_id)',
  );

  pgm.addConstraint(
    'collaborations',
    'fk_note_id.notes.id',
    'FOREIGN KEY(note_id) REFERENCES notes(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'collaborations',
    'fk_user_id.users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};
