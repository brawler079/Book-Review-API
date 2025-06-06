import Book from '../models/Book.js';
import Review from '../models/Review.js';

// Add a new book (Authenticated users only)
export const addBook = async (req, res) => {
  try {
    const { title, author, genre, description } = req.body;

    if (!title?.trim() || !author?.trim()) {
      return res.status(400).json({ message: 'Title and Author are required' });
    }

    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      genre: genre?.trim(),
      description: description?.trim() || '',
    });

    res.status(201).json({ message: 'Book added successfully', book });
  } catch (err) {
    console.error('Add Book Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch all books with optional filters and pagination
export const getBooks = async (req, res) => {
  try {
    const { author, genre, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (author) filter.author = new RegExp(author, 'i');
    if (genre) filter.genre = new RegExp(genre, 'i');

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [books, total] = await Promise.all([
      Book.find(filter).skip(skip).limit(parseInt(limit)),
      Book.countDocuments(filter),
    ]);

    res.json({
      currentPage: Number(page),
      totalBooks: total,
      totalPages: Math.ceil(total / limit),
      books,
    });
  } catch (err) {
    console.error('Get Books Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Book details with average rating & paginated reviews
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 5 } = req.query;

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const [reviews, allReviews] = await Promise.all([
      Review.find({ book: id })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('user', 'username'),
      Review.find({ book: id }),
    ]);

    const avgRating = allReviews.length
      ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
      : 0;

    res.json({
      book,
      averageRating: Number(avgRating),
      reviews,
      reviewPage: Number(page),
      totalReviews: allReviews.length,
      totalReviewPages: Math.ceil(allReviews.length / limit),
    });
  } catch (err) {
    console.error('Get Book By ID Error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search by title or author
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
