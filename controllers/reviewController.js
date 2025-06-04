import Review from '../models/Review.js';

export const addReview = async (req, res) => {
  const existing = await Review.findOne({ user: req.user.id, book: req.params.id });
  if (existing) return res.status(400).json({ message: 'Already reviewed' });

  const review = await Review.create({
    user: req.user.id,
    book: req.params.id,
    rating: req.body.rating,
    comment: req.body.comment,
  });

  res.status(201).json(review);
};

export const updateReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review || review.user.toString() !== req.user.id)
    return res.status(403).json({ message: 'Not allowed' });

  review.rating = req.body.rating;
  review.comment = req.body.comment;
  await review.save();

  res.json(review);
};

export const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review || review.user.toString() !== req.user.id)
    return res.status(403).json({ message: 'Not allowed' });

  await review.deleteOne();
  res.json({ message: 'Deleted' });
};
