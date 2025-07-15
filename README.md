# VibeFinder - Interactive City Vibe Discovery Platform

## Project Overview
VibeFinder is an innovative web application that helps users discover and share the unique "vibes" of different locations in their city. The platform combines interactive mapping, real-time data visualization, and social features to create a comprehensive city experience discovery tool.

## Key Features

### 1. Interactive Map Interface
- **Dynamic Location Markers**: Custom markers for different types of locations (cafes, restaurants, viewpoints, markets)
- **Zoom-Dependent Visibility**: Markers appear based on zoom level for better map clarity
- **Heatmap Visualization**: Shows the intensity of vibes across different areas
- **Customizable Legend**: Toggle-able heatmap intensity legend

### 2. Location Search & Discovery
- **Smart Search**: Search locations by name, vibe type, or features
- **Real-time Suggestions**: Dynamic search suggestions as you type
- **Location Details**: Comprehensive information about each place including:
  - Operating hours
  - Features and amenities
  - Vibe type and intensity
  - Popular times

### 3. Vibe Management
- **Add New Vibes**: Users can contribute new locations and vibes
- **Vibe Categories**: Multiple vibe types including:
  - Fun & Entertainment
  - Calm & Peaceful
  - Romantic
  - Energetic
  - Historical
  - Natural
  - Adventure
  - Religious

### 4. User Interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Theme**: Modern, eye-friendly interface
- **Interactive Sidebar**: Shows trending vibes and recent activity
- **Modal Dialogs**: For adding vibes and filtering options

## Technical Implementation

### Frontend Technologies
- **HTML5**: Semantic markup for structure
- **CSS3**: 
  - Tailwind CSS for utility-first styling
  - Custom animations and transitions
  - Responsive design patterns
- **JavaScript**:
  - Vanilla JS for core functionality
  - Leaflet.js for map implementation
  - Custom marker creation system
  - Event handling and DOM manipulation

### Map Features
- **Leaflet.js Integration**:
  - Custom tile layers
  - Marker clustering
  - Popup information windows
  - Heatmap visualization
- **Custom Markers**:
  - Different shapes for different location types
  - Color-coded based on vibe type
  - Interactive hover effects
  - Zoom-dependent visibility

### Data Management
- **Location Data Structure**:
  ```javascript
  {
    name: String,
    vibe: String,
    time: String,
    features: String,
    intensity: Number,
    color: String,
    lat: Number,
    lng: Number,
    type: String,
    minZoom: Number
  }
  ```
- **Vibe Categories**:
  - Shopping & Party
  - Historical & Market
  - Natural & Peaceful
  - Adventure & Family
  - Hill Station & Romantic
  - Himalayan & Couples
  - Wildlife & Natural
  - Religious & Peaceful

### Search Implementation
- **Local Search**:
  - Searches through predefined location data
  - Matches against name, vibe, and features
  - Real-time filtering and suggestions
- **OpenStreetMap Integration**:
  - Fallback search for locations not in local database
  - Geocoding using Nominatim API
  - Coordinate-based marker placement

### UI Components
- **Navigation Bar**:
  - Search functionality
  - Heatmap toggle
  - Filter options
  - Add vibe button
- **Sidebar**:
  - Trending vibes statistics
  - Recent activity feed
  - Mobile-responsive design
- **Modals**:
  - Add vibe form
  - Filter options
  - Location details

## Project Structure
```
vibefinder/
├── index.html          # Main HTML file
├── styles.css          # Custom styles
├── app.js             # Main application logic
├── locationData.js    # Location data and configurations
└── README.md          # Project documentation
```

## Future Enhancements
1. **User Authentication**:
   - User profiles
   - Saved locations
   - Personal vibe history

2. **Social Features**:
   - Vibe ratings and reviews
   - User recommendations
   - Social sharing

3. **Advanced Analytics**:
   - Vibe trends over time
   - Popular times visualization
   - User activity insights

4. **Mobile App**:
   - Native mobile application
   - Location-based notifications
   - Offline functionality

## Setup Instructions
1. Clone the repository
2. Open `index.html` in a modern web browser
3. No build process required - uses CDN for dependencies

## Dependencies
- Leaflet.js (v1.7.1)
- Tailwind CSS (v2.2.19)
- Font Awesome (v6.0.0)
- Leaflet.heat (v0.2.0)

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details. 