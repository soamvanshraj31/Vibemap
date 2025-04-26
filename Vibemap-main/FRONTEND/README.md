# VibeFinder

A real-time interactive map application that lets users share and discover the "vibe" of different locations in their city.

## Features

- Real-time vibe updates using Socket.IO
- Interactive map with custom markers
- Trending vibes statistics
- Recent activity feed
- Mobile-responsive design
- Filter vibes by type
- Location search functionality

## Tech Stack

- Frontend: HTML, CSS (Tailwind), JavaScript
- Backend: Node.js, Express
- Database: MongoDB
- Real-time: Socket.IO
- Map: Leaflet.js

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vibefinder.git
cd vibefinder
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/vibefinder
```

4. Start MongoDB service on your machine

5. Run the application:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

6. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Allow location access when prompted to center the map on your location
2. Click the "Add Vibe" button to add a new vibe to your current location
3. Select a vibe type and optionally add a description
4. Use the filter button to show/hide different types of vibes
5. Click on vibe markers to see details and like vibes
6. Use the search bar to find specific locations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 