// Initialize Socket.IO
const socket = io();

// Initialize map variables
let map;
let userMarker;
let accuracyCircle;
let vibeMarkers = new Map();
let userLocation = null;
let watchId = null;

// Show loading indicator
function showLoading() {
  document.getElementById('loadingLocation').classList.remove('hidden');
}

// Hide loading indicator
function hideLoading() {
  document.getElementById('loadingLocation').classList.add('hidden');
}

// Initialize map with user's location
function getUserLocation() {
  if ("geolocation" in navigator) {
    showLoading();
    
    // Get initial position with high accuracy
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        userLocation = [latitude, longitude];
        
        if (!map) {
          initializeMap([latitude, longitude]);
        } else {
          map.setView([latitude, longitude], 15);
          updateUserMarker([latitude, longitude], accuracy);
        }
        hideLoading();
        
        // Start watching position
        if (!watchId) {
          watchId = navigator.geolocation.watchPosition(
            (position) => {
              const { latitude, longitude, accuracy } = position.coords;
              userLocation = [latitude, longitude];
              updateUserMarker([latitude, longitude], accuracy);
            },
            (error) => {
              console.error("Error watching location:", error);
              if (error.code === 1) { // PERMISSION_DENIED
                alert("Please enable location services to use all features.");
              }
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            }
          );
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        hideLoading();
        if (error.code === 1) { // PERMISSION_DENIED
          alert("Please enable location services to use all features.");
        }
        // Default to a central location if geolocation fails
        if (!map) {
          initializeMap([40.7128, -74.0060]); // Default to New York
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
    if (!map) {
      initializeMap([40.7128, -74.0060]); // Default to New York
    }
  }
}

function initializeMap(center) {
  map = L.map('map', {
    center: center,
    zoom: 15,
    zoomControl: false,
    minZoom: 3,
    maxZoom: 18
  });
  
  // Add zoom control to the right
  L.control.zoom({
    position: 'topright'
  }).addTo(map);

  // Add custom location control
  L.Control.Location = L.Control.extend({
    onAdd: function(map) {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      const button = L.DomUtil.create('a', 'location-button', container);
      button.innerHTML = '<i class="fas fa-location-arrow"></i>';
      button.href = '#';
      button.title = 'Go to my location';
      
      L.DomEvent.on(button, 'click', function(e) {
        L.DomEvent.preventDefault(e);
        if (userLocation) {
          map.setView(userLocation, 15);
        } else {
          getUserLocation();
        }
      });
      
      return container;
    }
  });
  
  new L.Control.Location({ position: 'topright' }).addTo(map);

  // Add the tile layer with dark mode
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);

  // Initialize user marker with accuracy circle
  updateUserMarker(center, 0);

  // Add map click handler for adding vibes
  map.on('click', function(e) {
    const clickedLatLng = e.latlng;
    window.lastClickedLocation = clickedLatLng;
    
    // Show a temporary marker at clicked location
    if (window.tempMarker) {
      map.removeLayer(window.tempMarker);
    }
    window.tempMarker = L.marker(clickedLatLng, {
      icon: L.divIcon({
        className: 'vibe-marker temp-marker',
        html: '<div class="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">' +
              '<i class="fas fa-map-pin text-white"></i></div>'
      })
    }).addTo(map);
    
    // Open the add vibe modal
    document.getElementById('vibeModal').classList.remove('hidden');
  });
}

function updateUserMarker(position, accuracy) {
  // Update or create user marker
  if (userMarker) {
    userMarker.setLatLng(position);
  } else {
    userMarker = L.marker(position, {
      icon: L.divIcon({
        className: 'user-marker',
        html: '<div class="user-marker-icon">' +
              '<i class="fas fa-user"></i></div>'
      }),
      zIndexOffset: 1000
    }).addTo(map);
  }

  // Update or create accuracy circle
  if (accuracy) {
    if (accuracyCircle) {
      accuracyCircle.setLatLng(position).setRadius(accuracy);
    } else {
      accuracyCircle = L.circle(position, {
        radius: accuracy,
        className: 'accuracy-circle'
      }).addTo(map);
    }
  }
}

// Handle vibe addition
document.getElementById('addVibeBtn').addEventListener('click', () => {
  if (!userLocation) {
    getUserLocation();
  }
  // Clear any temporary marker
  if (window.tempMarker) {
    map.removeLayer(window.tempMarker);
    window.tempMarker = null;
  }
  document.getElementById('vibeModal').classList.remove('hidden');
});

document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('vibeModal').classList.add('hidden');
});

// Handle vibe type selection
document.querySelectorAll('.vibe-btn').forEach(button => {
  button.addEventListener('click', () => {
    const type = button.getAttribute('data-vibe');
    const description = document.getElementById('vibeDescription').value;
    
    // Use the clicked location or current map center
    const coordinates = window.lastClickedLocation || map.getCenter();
    
    const vibeData = {
      type,
      description,
      location: {
        type: 'Point',
        coordinates: [coordinates.lng, coordinates.lat]
      }
    };

    socket.emit('addVibe', vibeData);
    document.getElementById('vibeModal').classList.add('hidden');
    document.getElementById('vibeDescription').value = '';
    window.lastClickedLocation = null; // Reset clicked location
  });
});

// Handle real-time updates
socket.on('newVibe', (vibe) => {
  addVibeToMap(vibe);
  updateRecentActivity(vibe);
  updateTrendingVibes();
});

socket.on('vibeLiked', (vibe) => {
  updateVibeMarker(vibe);
  updateTrendingVibes();
});

function addVibeToMap(vibe) {
  const marker = L.marker([vibe.location.coordinates[1], vibe.location.coordinates[0]], {
    icon: L.divIcon({
      className: `vibe-marker ${vibe.type.toLowerCase()}`,
      html: `<div class="p-2 rounded-full bg-gradient-to-r ${getVibeColors(vibe.type)}">
              <i class="fas ${getVibeIcon(vibe.type)} text-white"></i>
            </div>`
    })
  }).addTo(map);

  marker.bindPopup(`
    <div class="p-2">
      <h3 class="font-bold">${vibe.type} Vibe</h3>
      ${vibe.description ? `<p class="text-sm mt-1">${vibe.description}</p>` : ''}
      <div class="flex items-center mt-2">
        <button class="like-btn text-sm" data-vibe-id="${vibe._id}">
          <i class="fas fa-heart mr-1"></i>${vibe.likes || 0}
        </button>
      </div>
    </div>
  `);

  vibeMarkers.set(vibe._id, marker);
}

function updateVibeMarker(vibe) {
  const marker = vibeMarkers.get(vibe._id);
  if (marker) {
    marker.getPopup().setContent(`
      <div class="p-2">
        <h3 class="font-bold">${vibe.type} Vibe</h3>
        ${vibe.description ? `<p class="text-sm mt-1">${vibe.description}</p>` : ''}
        <div class="flex items-center mt-2">
          <button class="like-btn text-sm" data-vibe-id="${vibe._id}">
            <i class="fas fa-heart mr-1"></i>${vibe.likes}
          </button>
        </div>
      </div>
    `);
  }
}

function updateRecentActivity(vibe) {
  const recentActivity = document.getElementById('recentActivity');
  const activityItem = document.createElement('div');
  activityItem.className = 'vibe-card p-4 rounded-lg';
  activityItem.innerHTML = `
    <div class="flex items-center mb-2">
      <div class="w-8 h-8 rounded-full bg-gradient-to-r ${getVibeColors(vibe.type)} flex items-center justify-center">
        <i class="fas ${getVibeIcon(vibe.type)} text-white"></i>
      </div>
      <div class="ml-3">
        <p class="text-sm">New ${vibe.type} vibe added</p>
        <p class="text-xs text-gray-400">Just now</p>
      </div>
    </div>
  `;
  
  recentActivity.insertBefore(activityItem, recentActivity.firstChild);
  if (recentActivity.children.length > 5) {
    recentActivity.removeChild(recentActivity.lastChild);
  }
}

async function updateTrendingVibes() {
  try {
    const response = await fetch('/api/trending');
    const trending = await response.json();
    
    const vibeStats = document.getElementById('vibeStats');
    vibeStats.innerHTML = trending.map(vibe => `
      <div class="vibe-card p-4 rounded-lg">
        <div class="flex justify-between items-center mb-2">
          <span class="${getVibeTextColor(vibe._id)}">
            <i class="fas ${getVibeIcon(vibe._id)} mr-2"></i>${vibe._id}
          </span>
          <span class="text-sm text-gray-400">${vibe.count} vibes today</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2">
          <div class="${getVibeProgressColor(vibe._id)} h-2 rounded-full" 
               style="width: ${(vibe.count / trending[0].count * 100)}%"></div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error updating trending vibes:', error);
  }
}

// Utility functions
function getVibeColors(type) {
  const colors = {
    Fun: 'from-yellow-500 to-yellow-600',
    Calm: 'from-blue-500 to-blue-600',
    Romantic: 'from-pink-500 to-pink-600',
    Energetic: 'from-red-500 to-red-600'
  };
  return colors[type] || 'from-purple-500 to-pink-500';
}

function getVibeIcon(type) {
  const icons = {
    Fun: 'fa-smile',
    Calm: 'fa-peace',
    Romantic: 'fa-heart',
    Energetic: 'fa-bolt'
  };
  return icons[type] || 'fa-star';
}

function getVibeTextColor(type) {
  const colors = {
    Fun: 'text-yellow-500',
    Calm: 'text-blue-500',
    Romantic: 'text-pink-500',
    Energetic: 'text-red-500'
  };
  return colors[type] || 'text-purple-500';
}

function getVibeProgressColor(type) {
  const colors = {
    Fun: 'bg-yellow-500',
    Calm: 'bg-blue-500',
    Romantic: 'bg-pink-500',
    Energetic: 'bg-red-500'
  };
  return colors[type] || 'bg-purple-500';
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  // Initialize geolocation
  getUserLocation();

  // Fetch initial vibes
  fetch('/api/vibes')
    .then(response => response.json())
    .then(vibes => {
      vibes.forEach(vibe => addVibeToMap(vibe));
      updateTrendingVibes();
    })
    .catch(error => console.error('Error fetching initial vibes:', error));

  // Handle sidebar toggle
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full');
    sidebarOverlay.classList.toggle('hidden');
  });

  sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
    sidebarOverlay.classList.add('hidden');
  });

  // Handle map filters
  document.getElementById('filterVibes').addEventListener('click', () => {
    document.getElementById('filterModal').classList.remove('hidden');
  });

  document.getElementById('closeFilterModal').addEventListener('click', () => {
    document.getElementById('filterModal').classList.add('hidden');
  });

  // Add search functionality using OpenStreetMap Nominatim
  const searchInput = document.getElementById('searchPlace');
  let searchTimeout;

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      clearTimeout(searchTimeout);
      const query = searchInput.value;
      
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            const { lat, lon } = data[0];
            map.setView([lat, lon], 13);
          }
        })
        .catch(error => console.error('Error searching location:', error));
    }
  });
}); 