// Full-stack VibeMap Project - Frontend + Backend Setup
// ---------------- FRONTEND CODE (React + Tailwind + Leaflet) ----------------

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from "@/components/ui/button";

export default function VibeMap() {
  const [selectedMood, setSelectedMood] = useState('');
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/moods')
      .then(res => res.json())
      .then(data => setMoods(data));
  }, []);

  const handleMoodSubmit = async () => {
    if (!selectedMood) return;
    const newMood = {
      mood: selectedMood,
      lat: 37.7749 + (Math.random() - 0.5) * 0.02,
      lng: -122.4194 + (Math.random() - 0.5) * 0.02,
    };

    const res = await fetch('http://localhost:5000/api/moods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMood)
    });

    const data = await res.json();
    setMoods([...moods, data]);
    setSelectedMood('');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-72 bg-gray-800 p-4 flex flex-col gap-6 text-white">
        <h1 className="text-2xl font-bold text-cyan-400">VibeMap</h1>
        <div>
          <h2 className="text-lg mb-2">Filters</h2>
          <ul className="space-y-2">
            <li>Happy</li>
            <li>Chill</li>
            <li>Romantic</li>
            <li>Busy</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg mb-2">Trending Moods</h2>
          <ul className="space-y-2">
            <li>Happy</li>
            <li>Chill</li>
            <li>Busy</li>
          </ul>
        </div>
      </div>

      {/* Map Section */}
      <div className="flex-1 relative">
        <MapContainer center={[37.7749, -122.4194]} zoom={13} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {moods.map((m, index) => (
            <Marker key={index} position={[m.lat, m.lng]}>
              <Popup>{m.mood}</Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Bottom Mood Submit Bar */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 p-4 rounded-xl flex gap-2">
          <select
            className="bg-gray-700 p-2 rounded-lg text-white"
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
          >
            <option value="">Select Mood</option>
            <option value="Happy">😊 Happy</option>
            <option value="Chill">😌 Chill</option>
            <option value="Romantic">❤️ Romantic</option>
            <option value="Busy">😵 Busy</option>
          </select>
          <Button onClick={handleMoodSubmit}>Submit</Button>
        </div>
      </div>
    </div>
  );
}

// ---------------- BACKEND CODE (Node.js + Express + MongoDB) ----------------

// Save this as backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/vibemap', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const moodSchema = new mongoose.Schema({
  mood: String,
  lat: Number,
  lng: Number,
  timestamp: { type: Date, default: Date.now },
});

const Mood = mongoose.model('Mood', moodSchema);

app.get('/api/moods', async (req, res) => {
  const moods = await Mood.find();
  res.json(moods);
});

app.post('/api/moods', async (req, res) => {
  const mood = new Mood(req.body);
  await mood.save();
  res.json(mood);
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
