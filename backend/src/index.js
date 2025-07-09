import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import inquiryRoutes from './routes/inquiry.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/inquiry', inquiryRoutes);

app.get('/', (req, res) => {
  res.send('ShangProperties Backend is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
