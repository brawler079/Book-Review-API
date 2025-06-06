import Review from '../models/Review.js';

//books/:id/reviews – Submit a review

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const bookId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check for existing review by user on this book
    const existing = await Review.findOne({ user: req.user.id, book: bookId });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const review = await Review.create({
      user: req.user.id,
      book: bookId,
      rating,
      comment: comment?.trim() || '',
    });

    res.status(201).json({
      message: 'Review submitted successfully',
      review,
    });
  } catch (err) {
    console.error('Add Review Error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//reviews/:id – Update your own review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update this review' });
    }

    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }
      review.rating = rating;
    }

    if (comment !== undefined) review.comment = comment.trim();
    await review.save();

    res.json({
      message: 'Review updated successfully',
      review,
    });
  } catch (err) {
    console.error('Update Review Error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//reviews/:id – Delete your own review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this review' });
    }

    await review.deleteOne();

    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Delete Review Error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
