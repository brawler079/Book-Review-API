import express from 'express';
import { addReview, updateReview, deleteReview } from '../controllers/reviewController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/books/:id/reviews', auth, addReview);
router.put('/reviews/:id', auth, updateReview);
router.delete('/reviews/:id', auth, deleteReview);

export default router;