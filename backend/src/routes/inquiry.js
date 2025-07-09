import express from 'express';
import { handleInquiry, getInquiries, updateInquiry, deleteInquiry } from '../controllers/inquiryController.js';

const router = express.Router();

// CREATE
router.post('/', handleInquiry);
// READ ALL
router.get('/', getInquiries);
// UPDATE
router.put('/:id', updateInquiry);
// DELETE
router.delete('/:id', deleteInquiry);

export default router;
