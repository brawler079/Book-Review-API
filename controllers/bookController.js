import Book from '../models/Book.js';
import Review from '../models/Review.js';

export const addBook = async (req, res) => {
  const book = await Book.create(req.body);
  res.status(201).json(book);
};

export const getBooks = async (req, res) => {
  const { author, genre, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (author) filter.author = new RegExp(author, 'i');
  if (genre) filter.genre = genre;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const books = await Book.find(filter).skip(skip).limit(parseInt(limit));

  res.json({ page: Number(page), books });
};

export const getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  const reviews = await Review.find({ book: book._id });
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  res.json({ book, avgRating, reviews });
};

export const searchBooks = async (req, res) => {
  const { q } = req.query;
  const books = await Book.find({
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { author: { $regex: q, $options: 'i' } },
    ],
  });
  res.json(books);
};