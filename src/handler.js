const { nanoid } = require('nanoid');
const books = require('./books');

const createBookHandler = (request, h) => {
  const data = request.payload;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = data;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name !== undefined) {
    // eslint-disable-next-line max-len
    const data = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())).map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: { books: data },
    });
    response.code(200);
    return response;
  }

  if (reading === '1') {
    const data = books.filter((book) => book.reading === true).map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: { books: data },
    });
    response.code(200);
    return response;
  }

  if (finished === '1') {
    const data = books.filter((book) => book.finished === true).map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    const response = h.response({
      status: 'success',
      data: { books: data },
    });
    response.code(200);
    return response;
  }

  const data = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  const response = h.response({
    status: 'success',
    data: { books: data },
  });
  response.code(200);
  return response;
};

const getBookHandler = (request, h) => {
  const { id } = request.params;

  // eslint-disable-next-line no-shadow
  const book = books.find((book) => book.id === id);

  if (book) {
    const response = h.response({
      status: 'success',
      data: { book },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const data = request.payload;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = data;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal diperbarui',
  });
  response.code(500);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  createBookHandler,
  getAllBooksHandler,
  getBookHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
