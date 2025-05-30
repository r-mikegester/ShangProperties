const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const inquiryRoutes = require('./routes/inquiry'); // This points to the file you just created


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/routes/inquiry', inquiryRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
