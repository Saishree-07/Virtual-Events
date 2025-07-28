const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();


app.use(cors({
  origin: 'http://localhost:3000', 
  methods: 'GET, POST, PUT, DELETE',
  credentials: true
}));


app.use(express.json());


mongoose.connect('mongodb://127.0.0.1:27017/virtual_event_db')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));


app.get('/', (req, res) => {
  res.send('✅ Server is running! Welcome to the Virtual Event Management Platform.');
});


app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
