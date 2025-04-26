// Vibe color mapping
const vibeColors = {
  'Shopping, Party': '#FFD700', // Gold
  'Historical, Market': '#8B4513', // Brown
  'Natural, Peaceful': '#228B22', // Forest Green
  'Adventure, Family': '#FF4500', // Orange Red
  'Hill Station, Romantic': '#FF69B4', // Hot Pink
  'Himalayan, Couples': '#4169E1', // Royal Blue
  'Wildlife, Natural': '#006400', // Dark Green
  'Religious, Peaceful': '#FFA500', // Orange
  'Natural, Family': '#32CD32' // Lime Green
};

// Function to create custom icon based on type
function createCustomIcon(type, color) {
  let iconHtml = '';
  switch(type) {
    case 'cafe':
      iconHtml = `<div style="
        background-color: ${color};
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 4px rgba(0,0,0,0.5);
      "></div>`;
      break;
    case 'restaurant':
      iconHtml = `<div style="
        background-color: ${color};
        width: 12px;
        height: 12px;
        transform: rotate(45deg);
        border: 2px solid white;
        box-shadow: 0 0 4px rgba(0,0,0,0.5);
      "></div>`;
      break;
    case 'viewpoint':
      iconHtml = `<div style="
        background-color: ${color};
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 12px solid ${color};
        border-top: 0;
        box-shadow: 0 0 4px rgba(0,0,0,0.5);
      "></div>`;
      break;
    case 'market':
      iconHtml = `<div style="
        background-color: ${color};
        width: 10px;
        height: 10px;
        border-radius: 2px;
        border: 2px solid white;
        box-shadow: 0 0 4px rgba(0,0,0,0.5);
      "></div>`;
      break;
    case 'travel':
      iconHtml = `<div style="
        background-color: ${color};
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 16px solid ${color};
        border-top: 0;
        position: relative;
        box-shadow: 0 0 4px rgba(0,0,0,0.5);
      ">
        <div style="
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>`;
      break;
    case 'hotel':
      iconHtml = `<div style="
        background-color: ${color};
        width: 12px;
        height: 12px;
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        border: 2px solid white;
        box-shadow: 0 0 4px rgba(0,0,0,0.5);
      "></div>`;
      break;
    default:
      iconHtml = `<div style="
        background-color: ${color};
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 4px rgba(0,0,0,0.5);
      "></div>`;
  }
  return L.divIcon({
    className: 'custom-div-icon',
    html: iconHtml,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
}

// Initialize map
const map = L.map('map').setView([30.3165, 78.0322], 10); // Centered on Dehradun

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Function to initialize markers
function initializeMarkers() {
  const markers = [];
  const bounds = L.latLngBounds();

  locationData.forEach(loc => {
    const marker = L.marker([loc.lat, loc.lng], {
      icon: createCustomIcon(loc.type || 'default', loc.color)
    })
    .bindPopup(`
      <div class="p-2">
        <h3 class="font-bold" style="color: ${loc.color}">${loc.name}</h3>
        <p><strong>Vibe:</strong> <span style="color: ${loc.color}">${loc.vibe}</span></p>
        <p><strong>Time:</strong> ${loc.time}</p>
        <p><strong>Features:</strong> ${loc.features}</p>
      </div>
    `);

    // Add zoom-dependent visibility
    if (loc.minZoom) {
      marker.addTo(map);
      map.on('zoomend', () => {
        if (map.getZoom() >= loc.minZoom) {
          marker.addTo(map);
        } else {
          marker.remove();
        }
      });
    } else {
      marker.addTo(map);
    }

    markers.push(marker);
    bounds.extend([loc.lat, loc.lng]);
  });

  // Fit map to show all markers
  if (markers.length > 0) {
    map.fitBounds(bounds.pad(0.1));
  }

  return markers;
}

// Initialize markers
let allMarkers = initializeMarkers();

// Create heatmap layer
const heat = L.heatLayer(locationData.map(loc => [loc.lat, loc.lng, loc.intensity]), {
  radius: 25,
  blur: 15,
  maxZoom: 10,
  gradient: {
    0.4: 'blue',
    0.6: 'lime',
    0.8: 'yellow',
    1.0: 'red'
  }
}).addTo(map);

// Heatmap Toggle
const heatmapToggle = document.getElementById('heatmapToggle');
const heatmapLegend = document.getElementById('heatmapLegend');
const toggleLegend = document.getElementById('toggleLegend');
let heatmapVisible = false;
let legendVisible = true;

heatmapToggle.addEventListener('click', () => {
  if (heatmapVisible) {
    map.removeLayer(heat);
    heatmapVisible = false;
    heatmapLegend.classList.add('hidden');
  } else {
    heat.addTo(map);
    heatmapVisible = true;
    heatmapLegend.classList.remove('hidden');
  }
});

toggleLegend.addEventListener('click', () => {
  if (legendVisible) {
    heatmapLegend.classList.add('hidden');
    legendVisible = false;
  } else {
    heatmapLegend.classList.remove('hidden');
    legendVisible = true;
  }
});

// Initially hide the legend if heatmap is not visible
if (!heatmapVisible) {
  heatmapLegend.classList.add('hidden');
}

// Sidebar toggle functionality
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('-translate-x-full');
  sidebarOverlay.classList.toggle('hidden');
});

sidebarOverlay.addEventListener('click', () => {
  sidebar.classList.add('-translate-x-full');
  sidebarOverlay.classList.add('hidden');
});

// Add Vibe Modal
const addVibeBtn = document.getElementById('addVibeBtn');
const vibeModal = document.getElementById('vibeModal');

addVibeBtn.addEventListener('click', () => {
  vibeModal.classList.remove('hidden');
});

vibeModal.addEventListener('click', (e) => {
  if (e.target === vibeModal) {
    vibeModal.classList.add('hidden');
  }
});

// Filter Modal
const filterVibes = document.getElementById('filterVibes');
const filterModal = document.getElementById('filterModal');

filterVibes.addEventListener('click', () => {
  filterModal.classList.remove('hidden');
});

filterModal.addEventListener('click', (e) => {
  if (e.target === filterModal) {
    filterModal.classList.add('hidden');
  }
});

// Search functionality
const searchInput = document.getElementById('searchPlace');
let searchMarker = null;
let searchCircle = null;

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim().toLowerCase();
  if (query.length > 0) {
    const matches = locationData.filter(loc => 
      loc.name.toLowerCase().includes(query) || 
      loc.vibe.toLowerCase().includes(query) ||
      loc.features.toLowerCase().includes(query)
    );

    // Create or update suggestions container
    let suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) {
      suggestionsContainer = document.createElement('div');
      suggestionsContainer.id = 'searchSuggestions';
      searchInput.parentElement.appendChild(suggestionsContainer);
    }

    if (matches.length > 0) {
      suggestionsContainer.innerHTML = matches
        .map(loc => `
          <div class="p-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0" 
               onclick="document.getElementById('searchPlace').value = '${loc.name}'; 
                       document.getElementById('searchSuggestions').remove();
                       document.getElementById('searchPlace').dispatchEvent(new KeyboardEvent('keypress', {key: 'Enter'}));">
            <div class="font-bold" style="color: ${loc.color}">${loc.name}</div>
            <div class="text-sm text-gray-400">${loc.vibe}</div>
            <div class="text-xs text-gray-500">${loc.features}</div>
          </div>
        `)
        .join('');
    } else {
      suggestionsContainer.innerHTML = '<div class="p-2 text-gray-400">No matches found</div>';
    }
  } else {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
      suggestionsContainer.remove();
    }
  }
});

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('#searchPlace') && !e.target.closest('#searchSuggestions')) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
      suggestionsContainer.remove();
    }
  }
}); 