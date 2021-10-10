const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { tags, title, body } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    id,
    title,
    body,
    tags,
    createdAt,
    updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (!isSuccess) {
    const response = h.response({
      status: 'fail',
      message: 'Catatan gagal ditambahkan',
    });
    response.code(500);
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Catatan berhasil ditambahkan',
    data: {
      noteId: id,
    },
  });
  response.code(201);
  return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.find((e) => e.id === id);

  if (!note) {
    const response = h.response({
      status: 'fail',
      message: 'Catatan tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  return {
    status: 'success',
    data: {
      note,
    },
  };
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((e) => e.id === id);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui catatan. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  notes[index] = {
    ...notes[index],
    title,
    tags,
    body,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Catatan berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((e) => e.id === id);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Catatal gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  notes.splice(index, 1);

  const response = h.response({
    status: 'success',
    message: 'Catatan berhasil dihapus',
  });
  response.code(200);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};