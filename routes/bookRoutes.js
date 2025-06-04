import express from 'express';
import { addBook, getBooks, getBookById, searchBooks } from '../controllers/bookController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/', auth, addBook);
router.get('/', getBooks);
router.get('/search', searchBooks);
router.get('/:id', getBookById);

export default router;