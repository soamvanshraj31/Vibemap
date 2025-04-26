require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vibefinder', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Mongoose Models
const Vibe = mongoose.model('Vibe', {
  type: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  description: String,
  timestamp: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 }
});

// Routes
app.get('/api/vibes', async (req, res) => {
  try {
    const vibes = await Vibe.find().sort({ timestamp: -1 }).limit(50);
    res.json(vibes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching vibes' });
  }
});

app.post('/api/vibes', async (req, res) => {
  try {
    const vibe = new Vibe(req.body);
    await vibe.save();
    io.emit('newVibe', vibe);
    res.status(201).json(vibe);
  } catch (error) {
    res.status(500).json({ error: 'Error creating vibe' });
  }
});

app.get('/api/trending', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const trending = await Vibe.aggregate([
      { $match: { timestamp: { $gte: today } } },
      { $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalLikes: { $sum: '$likes' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json(trending);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching trending vibes' });
  }
});

// Socket.IO Events
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('addVibe', async (vibeData) => {
    try {
      const vibe = new Vibe(vibeData);
      await vibe.save();
      io.emit('newVibe', vibe);
    } catch (error) {
      socket.emit('error', { message: 'Error adding vibe' });
    }
  });

  socket.on('likeVibe', async (vibeId) => {
    try {
      const vibe = await Vibe.findByIdAndUpdate(
        vibeId,
        { $inc: { likes: 1 } },
        { new: true }
      );
      io.emit('vibeLiked', vibe);
    } catch (error) {
      socket.emit('error', { message: 'Error liking vibe' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 