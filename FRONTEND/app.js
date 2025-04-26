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
  // Define icon styles based on location type
  let iconHtml = '';
  
  switch(type) {
    case 'natural':
      // Mountain icon for natural places
      iconHtml = `
        <div style="
          background-color: ${color};
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          border: 2px solid white;
        ">
          <div style="
            width: 0;
            height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-bottom: 8px solid white;
            transform: translateY(-2px);
          "></div>
        </div>
      `;
      break;
      
    case 'hillstation':
      // House with mountain icon for hill stations
      iconHtml = `
        <div style="
          background-color: ${color};
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          border: 2px solid white;
        ">
          <div style="
            width: 9px;
            height: 6px;
            background-color: white;
            position: relative;
            transform: translateY(2px);
          ">
            <div style="
              position: absolute;
              top: -3px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 4px solid transparent;
              border-right: 4px solid transparent;
              border-bottom: 3px solid white;
            "></div>
          </div>
        </div>
      `;
      break;
      
    case 'temple':
      // Temple icon with dome
      iconHtml = `
        <div style="
          background-color: ${color};
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          border: 2px solid white;
        ">
          <div style="
            width: 9px;
            height: 9px;
            background-color: white;
            border-radius: 50% 50% 0 0;
            position: relative;
          ">
            <div style="
              position: absolute;
              top: -1px;
              left: 50%;
              transform: translateX(-50%);
              width: 6px;
              height: 3px;
              background-color: white;
              border-radius: 50% 50% 0 0;
            "></div>
          </div>
        </div>
      `;
      break;
      
    case 'adventure':
      // Mountain with flag icon for adventure spots
      iconHtml = `
        <div style="
          background-color: ${color};
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          border: 2px solid white;
        ">
          <div style="
            width: 0;
            height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-bottom: 8px solid white;
            position: relative;
            transform: translateY(-2px);
          ">
            <div style="
              position: absolute;
              top: -6px;
              left: 1px;
              width: 1px;
              height: 4px;
              background-color: white;
            ">
              <div style="
                position: absolute;
                top: 0;
                left: -1px;
                width: 3px;
                height: 2px;
                background-color: white;
                clip-path: polygon(0 0, 100% 0, 50% 100%);
              "></div>
            </div>
          </div>
        </div>
      `;
      break;
      
    case 'wildlife':
      // Paw print icon for wildlife locations
      iconHtml = `
        <div style="
          background-color: ${color};
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          border: 2px solid white;
        ">
          <div style="
            width: 9px;
            height: 9px;
            position: relative;
          ">
            <div style="
              position: absolute;
              width: 4px;
              height: 4px;
              background-color: white;
              border-radius: 50%;
              top: 0;
              left: 2px;
            "></div>
            <div style="
              position: absolute;
              width: 3px;
              height: 3px;
              background-color: white;
              border-radius: 50%;
              top: 4px;
              left: 0;
            "></div>
            <div style="
              position: absolute;
              width: 3px;
              height: 3px;
              background-color: white;
              border-radius: 50%;
              top: 4px;
              right: 0;
            "></div>
          </div>
        </div>
      `;
      break;
      
    case 'market':
      // Shopping bag icon for markets
      iconHtml = `
        <div style="
          background-color: ${color};
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          border: 2px solid white;
        ">
          <div style="
            width: 8px;
            height: 9px;
            background-color: white;
            border-radius: 0 0 3px 3px;
            position: relative;
          ">
            <div style="
              position: absolute;
              top: -1px;
              left: 50%;
              transform: translateX(-50%);
              width: 4px;
              height: 3px;
              background-color: white;
              border-radius: 2px 2px 0 0;
            "></div>
            <div style="
              position: absolute;
              top: -3px;
              left: 50%;
              transform: translateX(-50%);
              width: 1px;
              height: 2px;
              background-color: white;
            "></div>
          </div>
        </div>
      `;
      break;
      
    case 'cafe':
      // Coffee cup icon for cafes
      iconHtml = `
        <div style="
          background-color: ${color};
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          border: 2px solid white;
        ">
          <div style="
            width: 8px;
            height: 9px;
            background-color: white;
            border-radius: 3px 3px 0 0;
            position: relative;
          ">
            <div style="
              position: absolute;
              top: -1px;
              left: 50%;
              transform: translateX(-50%);
              width: 4px;
              height: 1px;
              background-color: white;
            "></div>
            <div style="
              position: absolute;
              bottom: -1px;
              left: 50%;
              transform: translateX(-50%);
              width: 3px;
              height: 1px;
              background-color: white;
            "></div>
          </div>
        </div>
      `;
      break;
      
    case 'restaurant':
      // Fork and knife icon for restaurants
      iconHtml = `
        <div style="
          background-color: ${color};
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          border: 2px solid white;
        ">
          <div style="
            width: 9px;
            height: 9px;
            position: relative;
          ">
            <div style="
              position: absolute;
              width: 1px;
              height: 8px;
              background-color: white;
              left: 1px;
              top: 1px;
            "></div>
            <div style="
              position: absolute;
              width: 1px;
              height: 8px;
              background-color: white;
              right: 1px;
              top: 1px;
            "></div>
          </div>
        </div>
      `;
      break;
      
    case 'travel':
      // Train icon for travel locations
      iconHtml = `
        <div style="
          background-color: ${color};
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          border: 2px solid white;
        ">
          <div style="
            width: 10px;
            height: 6px;
            background-color: white;
            border-radius: 1px;
            position: relative;
          ">
            <div style="
              position: absolute;
              width: 3px;
              height: 3px;
              background-color: white;
              border-radius: 50%;
              bottom: -1px;
              left: 1px;
            "></div>
            <div style="
              position: absolute;
              width: 3px;
              height: 3px;
              background-color: white;
              border-radius: 50%;
              bottom: -1px;
              right: 1px;
            "></div>
          </div>
        </div>
      `;
      break;
      
    case 'hotel':
      // Building icon for hotels
      iconHtml = `
        <div style="
          background-color: ${color};
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          border: 2px solid white;
        ">
          <div style="
            width: 9px;
            height: 9px;
            background-color: white;
            position: relative;
          ">
            <div style="
              position: absolute;
              top: -1px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 4px solid transparent;
              border-right: 4px solid transparent;
              border-bottom: 3px solid white;
            "></div>
            <div style="
              position: absolute;
              bottom: 1px;
              left: 50%;
              transform: translateX(-50%);
              width: 1px;
              height: 3px;
              background-color: ${color};
            "></div>
          </div>
        </div>
      `;
      break;
      
    default:
      // Default marker for other types
      iconHtml = `
        <div style="
          background-color: ${color};
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          border: 2px solid white;
        ">
          <div style="
            width: 6px;
            height: 6px;
            background-color: white;
            border-radius: 50%;
          "></div>
        </div>
      `;
  }
  
  return L.divIcon({
    html: iconHtml,
    className: 'custom-icon',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -9]
  });
}

// Function to create a legend for the map
function createMapLegend() {
  const legend = L.control({ position: 'bottomleft' });
  
  legend.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'map-legend');
    div.style.backgroundColor = 'rgba(17, 24, 39, 0.8)';
    div.style.padding = '10px';
    div.style.borderRadius = '5px';
    div.style.color = 'white';
    div.style.fontSize = '12px';
    div.style.maxWidth = '200px';
    div.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    
    // Create legend title
    const title = L.DomUtil.create('div', '', div);
    title.innerHTML = '<strong>Location Types</strong>';
    title.style.marginBottom = '8px';
    title.style.borderBottom = '1px solid rgba(255,255,255,0.2)';
    title.style.paddingBottom = '5px';
    
    // Create legend items
    const types = [
      { type: 'natural', label: 'Natural Beauty', color: '#228B22' },
      { type: 'hillstation', label: 'Hill Station', color: '#FF69B4' },
      { type: 'temple', label: 'Temple', color: '#FFA500' },
      { type: 'adventure', label: 'Adventure', color: '#FF4500' },
      { type: 'wildlife', label: 'Wildlife', color: '#006400' },
      { type: 'market', label: 'Market', color: '#FFD700' },
      { type: 'cafe', label: 'Cafe', color: '#8B4513' },
      { type: 'restaurant', label: 'Restaurant', color: '#FF4500' },
      { type: 'travel', label: 'Travel', color: '#4169E1' },
      { type: 'hotel', label: 'Hotel', color: '#FFD700' }
    ];
    
    types.forEach(item => {
      const itemDiv = L.DomUtil.create('div', '', div);
      itemDiv.style.display = 'flex';
      itemDiv.style.alignItems = 'center';
      itemDiv.style.marginBottom = '5px';
      
      // Create icon container
      const iconContainer = L.DomUtil.create('div', '', itemDiv);
      iconContainer.style.width = '18px';
      iconContainer.style.height = '18px';
      iconContainer.style.marginRight = '8px';
      iconContainer.style.display = 'flex';
      iconContainer.style.alignItems = 'center';
      iconContainer.style.justifyContent = 'center';
      
      // Create icon using the same function as markers
      const icon = createCustomIcon(item.type, item.color);
      iconContainer.innerHTML = icon.options.html;
      
      // Create label
      const label = L.DomUtil.create('div', '', itemDiv);
      label.innerHTML = item.label;
    });
    
    return div;
  };
  
  return legend;
}

// Initialize map
const map = L.map('map').setView([30.3165, 78.0322], 10); // Centered on Dehradun

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Add legend to map
createMapLegend().addTo(map);

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

// Add Vibe Modal Functionality
const addVibeBtn = document.getElementById('addVibeBtn');
const vibeModal = document.getElementById('vibeModal');
const closeModal = document.getElementById('closeModal');
const cancelAddVibe = document.getElementById('cancelAddVibe');
const confirmAddVibe = document.getElementById('confirmAddVibe');
const vibeDescription = document.getElementById('vibeDescription');
let selectedVibe = null;

// Show modal when Add Vibe button is clicked
addVibeBtn.addEventListener('click', () => {
  vibeModal.classList.remove('hidden');
  selectedVibe = null;
  vibeDescription.value = '';
  // Reset any previously selected vibe buttons
  document.querySelectorAll('.vibe-btn').forEach(btn => {
    btn.classList.remove('ring-2', 'ring-white');
  });
});

// Close modal handlers
[closeModal, cancelAddVibe].forEach(button => {
  button.addEventListener('click', () => {
    vibeModal.classList.add('hidden');
    selectedVibe = null;
    vibeDescription.value = '';
  });
});

// Close modal when clicking outside
vibeModal.addEventListener('click', (e) => {
  if (e.target === vibeModal) {
    vibeModal.classList.add('hidden');
    selectedVibe = null;
    vibeDescription.value = '';
  }
});

// Handle vibe type selection
document.querySelectorAll('.vibe-btn').forEach(button => {
  button.addEventListener('click', () => {
    // Remove selection from all buttons
    document.querySelectorAll('.vibe-btn').forEach(btn => {
      btn.classList.remove('ring-2', 'ring-white');
    });
    // Add selection to clicked button
    button.classList.add('ring-2', 'ring-white');
    selectedVibe = button.getAttribute('data-vibe');
  });
});

// Handle Add Vibe confirmation
confirmAddVibe.addEventListener('click', () => {
  if (!selectedVibe) {
    alert('Please select a vibe type');
    return;
  }

  const description = vibeDescription.value.trim();
  const coordinates = map.getCenter();
  
  const vibeData = {
    type: selectedVibe,
    description: description,
    location: {
      type: 'Point',
      coordinates: [coordinates.lng, coordinates.lat]
    }
  };

  // Add the vibe marker to the map
  const marker = L.marker([coordinates.lat, coordinates.lng], {
    icon: L.divIcon({
      className: `vibe-marker ${selectedVibe.toLowerCase()}`,
      html: `<div class="p-2 rounded-full bg-gradient-to-r ${getVibeColors(selectedVibe)}">
              <i class="fas ${getVibeIcon(selectedVibe)} text-white"></i>
            </div>`
    })
  }).addTo(map);

  // Add popup to the marker
  marker.bindPopup(`
    <div class="p-2">
      <h3 class="font-bold">${selectedVibe} Vibe</h3>
      ${description ? `<p class="text-sm mt-1">${description}</p>` : ''}
      <div class="flex items-center mt-2">
        <button class="like-btn text-sm" data-vibe-id="new">
          <i class="fas fa-heart mr-1"></i>0
        </button>
      </div>
    </div>
  `);

  // Update recent activity
  updateRecentActivity({
    type: selectedVibe,
    description: description || `New ${selectedVibe} vibe added`
  });

  // Close the modal and reset
  vibeModal.classList.add('hidden');
  selectedVibe = null;
  vibeDescription.value = '';
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
    const matches = locationData.filter(loc => {
      const name = (loc.name || '').toLowerCase();
      const vibe = (loc.vibe || '').toLowerCase();
      const features = (loc.features || '').toLowerCase();
      // Allow partial and multi-word vibe search
      return name.includes(query) || vibe.includes(query) || features.includes(query) ||
        vibe.split(',').some(v => v.trim().includes(query));
    });

    // Create or update suggestions container
    let suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) {
      suggestionsContainer = document.createElement('div');
      suggestionsContainer.id = 'searchSuggestions';
      suggestionsContainer.style.position = 'absolute';
      suggestionsContainer.style.background = '#222';
      suggestionsContainer.style.width = searchInput.offsetWidth + 'px';
      suggestionsContainer.style.zIndex = 1000;
      suggestionsContainer.style.maxHeight = '250px';
      suggestionsContainer.style.overflowY = 'auto';
      searchInput.parentElement.appendChild(suggestionsContainer);
    }

    if (matches.length > 0) {
      suggestionsContainer.innerHTML = matches
        .map(loc => `
          <div class="p-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0" 
               onclick="window.selectLocationByName('${loc.name.replace(/'/g, "\\'")}')">
            <div class="font-bold" style="color: ${loc.color}">${loc.name}</div>
            <div class="text-sm text-gray-400">${loc.vibe || ''}</div>
            <div class="text-xs text-gray-500">${loc.features || ''}</div>
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

// Helper to select and zoom to a location by name
window.selectLocationByName = function(name) {
  const loc = locationData.find(l => l.name === name);
  if (loc) {
    map.setView([loc.lat, loc.lng], 16);
    // Optionally, open popup for the marker if available
    if (allMarkers) {
      const marker = allMarkers.find(m => m.getLatLng().lat === loc.lat && m.getLatLng().lng === loc.lng);
      if (marker) marker.openPopup();
    }
  }
  document.getElementById('searchPlace').value = name;
  const suggestionsContainer = document.getElementById('searchSuggestions');
  if (suggestionsContainer) suggestionsContainer.remove();
};

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('#searchPlace') && !e.target.closest('#searchSuggestions')) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
      suggestionsContainer.remove();
    }
  }
});

// Function to filter markers based on selected vibes
function filterMarkers() {
  const selectedVibes = Array.from(document.querySelectorAll('.vibe-filter:checked')).map(checkbox => checkbox.value);
  
  // Clear existing markers
  allMarkers.forEach(marker => {
    map.removeLayer(marker);
  });
  allMarkers = [];
  
  // Add filtered markers
  locationData.forEach(location => {
    // Check if location has any of the selected vibes
    const locationVibes = location.vibe ? location.vibe.split(',').map(v => v.trim()) : [];
    const hasSelectedVibe = selectedVibes.some(vibe => locationVibes.includes(vibe));
    
    // Also check location type if available
    const hasMatchingType = location.type && selectedVibes.includes(location.type);
    
    // Check for category matches (natural, hillstation, temple, adventure, etc.)
    const hasMatchingCategory = selectedVibes.some(category => {
      // Check if the location's vibe contains the category
      const vibeContainsCategory = locationVibes.some(vibe => 
        vibe.toLowerCase().includes(category.toLowerCase())
      );
      
      // Check if the location's type matches the category
      const typeMatchesCategory = location.type && 
        location.type.toLowerCase() === category.toLowerCase();
      
      return vibeContainsCategory || typeMatchesCategory;
    });
    
    if (hasSelectedVibe || hasMatchingType || hasMatchingCategory) {
      const marker = createMarker(location);
      allMarkers.push(marker);
      marker.addTo(map);
    }
  });
  
  // Update heatmap if visible
  if (heatmapVisible) {
    updateHeatmap();
  }
  
  // Fit map to show all markers if there are any
  if (allMarkers.length > 0) {
    const bounds = L.latLngBounds(allMarkers.map(marker => marker.getLatLng()));
    map.fitBounds(bounds.pad(0.1));
  }
}

// Function to create a marker for a location
function createMarker(location) {
  const icon = createCustomIcon(location.type || 'default', location.color || '#8B5CF6');
  
  const marker = L.marker([location.lat, location.lng], { icon: icon });
  
  // Create popup content
  const popupContent = `
    <div class="popup-content">
      <h3 class="font-bold text-lg">${location.name}</h3>
      <p class="text-sm text-gray-600">${location.vibe || 'No vibe specified'}</p>
      ${location.time ? `<p class="text-xs text-gray-500"><i class="fas fa-clock mr-1"></i>${location.time}</p>` : ''}
      ${location.features ? `<p class="text-xs text-gray-500"><i class="fas fa-info-circle mr-1"></i>${location.features}</p>` : ''}
      ${location.intensity ? `<p class="text-xs text-gray-500"><i class="fas fa-fire mr-1"></i>Intensity: ${location.intensity}/10</p>` : ''}
    </div>
  `;
  
  marker.bindPopup(popupContent);
  
  // Add zoom-dependent visibility if minZoom is specified
  if (location.minZoom) {
    marker.on('add', function() {
      updateMarkerVisibility(marker, location.minZoom);
    });
    
    map.on('zoomend', function() {
      updateMarkerVisibility(marker, location.minZoom);
    });
  }
  
  return marker;
}

// Function to update marker visibility based on zoom level
function updateMarkerVisibility(marker, minZoom) {
  if (map.getZoom() >= minZoom) {
    marker.setOpacity(1);
  } else {
    marker.setOpacity(0);
  }
}

// Event listener for filter button
document.getElementById('filterVibes').addEventListener('click', function() {
  document.getElementById('filterModal').classList.remove('hidden');
});

// Event listener for close filter modal button
document.getElementById('closeFilterModal').addEventListener('click', function() {
  document.getElementById('filterModal').classList.add('hidden');
});

// Event listener for apply filters button
document.getElementById('applyFilters').addEventListener('click', function() {
  filterMarkers();
  document.getElementById('filterModal').classList.add('hidden');
});

// URL Parameter Handler
document.addEventListener('DOMContentLoaded', function() {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');
  
  if (filterParam) {
    // Wait for the map to initialize
    setTimeout(() => {
      // Find the filter button and click it to open the filter modal
      const filterButton = document.getElementById('filterVibes');
      if (filterButton) {
        filterButton.click();
        
        // Wait for the modal to open
        setTimeout(() => {
          // Find all checkboxes and uncheck them first
          const checkboxes = document.querySelectorAll('.vibe-filter');
          checkboxes.forEach(checkbox => {
            checkbox.checked = false;
          });
          
          // Check only the matching filter
          const matchingCheckbox = Array.from(checkboxes).find(checkbox => 
            checkbox.value.toLowerCase() === filterParam.toLowerCase()
          );
          
          if (matchingCheckbox) {
            matchingCheckbox.checked = true;
            
            // Click the apply filters button
            const applyButton = document.getElementById('applyFilters');
            if (applyButton) {
              applyButton.click();
            }
          }
        }, 500);
      }
    }, 1000);
  }
}); 