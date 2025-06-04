import Book from '../models/Book.js';
import Review from '../models/Review.js';

// Add a new book
export const addBook = async (req, res) => {
  try {
    const { title, author, genre } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: 'Title and Author are required' });
    }

    const book = await Book.create(req.body);
    res.status(201).json({ message: 'Book added successfully', book });
  } catch (err) {
    console.error('Add Book Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get books with filters and pagination
export const getBooks = async (req, res) => {
  try {
    const { author, genre, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (author) filter.author = new RegExp(author, 'i');
    if (genre) filter.genre = genre;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const books = await Book.find(filter).skip(skip).limit(parseInt(limit));
    const total = await Book.countDocuments(filter);

    res.json({
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      totalBooks: total,
      books,
    });
  } catch (err) {
    console.error('Get Books Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get book details by ID with average rating and reviews
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 5 } = req.query;

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const reviews = await Review.find({ book: id })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('user', 'username');

    const allReviews = await Review.find({ book: id });
    const avgRating = allReviews.length 
      ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1) : 0;

    res.json({
      book,
      avgRating: Number(avgRating),
      reviews,
      reviewPage: Number(page),
      totalReviews: allReviews.length,
    });
  } catch (err) {
    console.error('Get Book By ID Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search books by title or author
export const searchBooks = async (req, res) => {
  try {
    const query = req.query.q?.trim();
    if (!query) return res.status(400).json({ message: 'Search query missing' });

    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
      ],
    });

    res.json({ total: books.length, books });
  } catch (err) {
    console.error('Search Books Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
