require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose= require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/Note');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(express.json());

app.use(cors(
    {
        origin:'https://saas-notes-gamma.vercel.app',
        credentials: true
    }
));

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/admin', adminRoutes);

mongoose.connect(process.env.MONGO_URI, {})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));


app.get('/',(req,res) => {
    res.send('Server is working');
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port: http://localhost:${process.env.PORT || 5000}`);
});