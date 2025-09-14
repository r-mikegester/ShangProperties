import express from 'express';
import { handleInquiry, getInquiries, updateInquiry, deleteInquiry } from '../controllers/inquiryController.js';

const router = express.Router();

// Log all requests to this route
router.use((req, res, next) => {
  console.log(`Inquiry route accessed: ${req.method} ${req.url}`);
  next();
});

// CREATE
router.post('/', handleInquiry);
// READ ALL
router.get('/', getInquiries);
// UPDATE
router.put('/:id', updateInquiry);
// DELETE
router.delete('/:id', deleteInquiry);

export default router;