const mapDBToModel = (note) => ({
  id: note.id,
  title: note.title,
  body: note.body,
  tags: note.tags,
  createdAt: note.created_at,
  updatedAt: note.updated_at,
});

module.exports = { mapDBToModel };
