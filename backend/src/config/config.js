import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 5000,
  // Add other config variables here
};
