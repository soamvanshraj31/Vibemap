// Map styling for dark theme
const mapStyles = [
    {
        "elementType": "geometry",
        "stylers": [{"color": "#242f3e"}]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#746855"}]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{"color": "#242f3e"}]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#d59563"}]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#d59563"}]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{"color": "#263c3f"}]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#6b9a76"}]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{"color": "#38414e"}]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{"color": "#212a37"}]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#9ca5b3"}]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{"color": "#17263c"}]
    }
];

// Vibe marker colors and icons
const vibeConfig = {
    Fun: {
        color: '#EAB308',
        icon: 'fa-smile',
        gradient: ['#EAB308', '#FCD34D']
    },
    Calm: {
        color: '#3B82F6',
        icon: 'fa-peace',
        gradient: ['#3B82F6', '#60A5FA']
    },
    Romantic: {
        color: '#EC4899',
        icon: 'fa-heart',
        gradient: ['#EC4899', '#F472B6']
    },
    Energetic: {
        color: '#EF4444',
        icon: 'fa-bolt',
        gradient: ['#EF4444', '#F87171']
    }
};

// Store app state
let state = {
    map: null,
    markers: [],
    heatmap: null,
    currentInfoWindow: null,
    searchBox: null,
    activeVibeTypes: new Set(['Fun', 'Calm', 'Romantic', 'Energetic']),
    vibeStats: {
        Fun: 0,
        Calm: 0,
        Romantic: 0,
        Energetic: 0
    },
    recentActivity: []
};

// Initialize the map and features
function initMap() {
    // Default to San Francisco coordinates
    const defaultLocation = { lat: 37.7749, lng: -122.4194 };
    
    // Create map instance
    state.map = new google.maps.Map(document.getElementById('map'), {
        center: defaultLocation,
        zoom: 13,
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: true
    });

    // Initialize search box
    initSearchBox();

    // Try to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                state.map.setCenter(pos);
                // Add initial sample vibes around user's location
                addSampleVibes(pos);
            },
            () => {
                console.log('Error: The Geolocation service failed.');
                addSampleVibes(defaultLocation);
            }
        );
    }

    // Add click listener to map for adding new vibes
    state.map.addListener('click', (e) => {
        showVibeModal(e.latLng);
    });

    // Initialize heatmap layer
    state.heatmap = new google.maps.visualization.HeatmapLayer({
        data: [],
        map: null, // Initially hidden
        radius: 30,
        gradient: [
            'rgba(0, 0, 0, 0)',
            'rgba(255, 255, 255, 0.5)',
            'rgba(255, 255, 255, 0.7)',
            'rgba(255, 255, 255, 0.9)',
            'rgba(255, 255, 255, 1)'
        ]
    });

    // Update sidebar initially
    updateSidebar();
}

// Initialize search box
function initSearchBox() {
    const input = document.getElementById('searchPlace');
    state.searchBox = new google.maps.places.SearchBox(input);

    state.searchBox.addListener('places_changed', () => {
        const places = state.searchBox.getPlaces();
        if (places.length === 0) return;

        const bounds = new google.maps.LatLngBounds();
        places.forEach(place => {
            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        state.map.fitBounds(bounds);
    });
}

// Add sample vibes around a location
function addSampleVibes(center) {
    const vibeTypes = ['Fun', 'Calm', 'Romantic', 'Energetic'];
    for (let i = 0; i < 20; i++) {
        const lat = center.lat + (Math.random() - 0.5) * 0.1;
        const lng = center.lng + (Math.random() - 0.5) * 0.1;
        const vibeType = vibeTypes[Math.floor(Math.random() * vibeTypes.length)];
        addVibe({ lat, lng }, vibeType, `Sample ${vibeType} Location ${i + 1}`);
    }
}

// Show the vibe selection modal
function showVibeModal(location) {
    const modal = document.getElementById('vibeModal');
    modal.classList.remove('hidden');
    
    // Store location in the modal for later use
    modal.dataset.lat = location.lat();
    modal.dataset.lng = location.lng();

    // Add click listeners to vibe buttons
    document.querySelectorAll('.vibe-btn').forEach(btn => {
        btn.onclick = () => {
            const description = document.getElementById('vibeDescription').value;
            addVibe(location, btn.dataset.vibe, description);
        };
    });
}

// Add a new vibe marker to the map
function addVibe(location, vibeType, description = '') {
    if (!state.activeVibeTypes.has(vibeType)) return;

    const marker = new google.maps.Marker({
        position: location,
        map: state.map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: vibeConfig[vibeType].color,
            fillOpacity: 0.8,
            strokeWeight: 2,
            strokeColor: '#FFFFFF'
        },
        title: vibeType,
        animation: google.maps.Animation.DROP
    });

    // Create info window with enhanced content
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div class="bg-gray-800 p-3 rounded-lg shadow-lg max-w-xs">
                <div class="flex items-center mb-2">
                    <i class="fas ${vibeConfig[vibeType].icon} text-${vibeConfig[vibeType].color} mr-2"></i>
                    <h3 class="font-bold text-white">${vibeType} Vibe</h3>
                </div>
                ${description ? `<p class="text-gray-300 mb-2">${description}</p>` : ''}
                <p class="text-gray-400 text-sm">Added ${new Date().toLocaleString()}</p>
            </div>
        `
    });

    // Add click listener to marker
    marker.addListener('click', () => {
        if (state.currentInfoWindow) {
            state.currentInfoWindow.close();
        }
        infoWindow.open(state.map, marker);
        state.currentInfoWindow = infoWindow;
    });

    // Store marker and update stats
    state.markers.push({ marker, vibeType, location });
    state.vibeStats[vibeType]++;
    state.recentActivity.unshift({
        type: vibeType,
        description: description || `New ${vibeType} vibe added`,
        timestamp: new Date()
    });
    if (state.recentActivity.length > 10) state.recentActivity.pop();

    // Update heatmap data
    updateHeatmap();
    
    // Update sidebar
    updateSidebar();
    
    closeModal();
}

// Update the heatmap data
function updateHeatmap() {
    const heatmapData = state.markers
        .filter(m => state.activeVibeTypes.has(m.vibeType))
        .map(m => ({
            location: new google.maps.LatLng(m.location.lat, m.location.lng),
            weight: 1
        }));
    state.heatmap.setData(heatmapData);
}

// Update sidebar content
function updateSidebar() {
    // Update vibe stats
    const vibeStats = document.getElementById('vibeStats');
    vibeStats.innerHTML = Object.entries(state.vibeStats)
        .map(([type, count]) => `
            <div class="vibe-card p-4 rounded-lg">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="fas ${vibeConfig[type].icon} text-${vibeConfig[type].color} text-xl mr-3"></i>
                        <span class="font-semibold">${type}</span>
                    </div>
                    <span class="text-2xl font-bold">${count}</span>
                </div>
            </div>
        `).join('');

    // Update recent activity
    const recentActivity = document.getElementById('recentActivity');
    recentActivity.innerHTML = state.recentActivity
        .map(activity => `
            <div class="vibe-card p-4 rounded-lg">
                <div class="flex items-center mb-2">
                    <i class="fas ${vibeConfig[activity.type].icon} text-${vibeConfig[activity.type].color} mr-2"></i>
                    <span class="font-semibold">${activity.description}</span>
                </div>
                <p class="text-sm text-gray-400">${timeAgo(activity.timestamp)}</p>
            </div>
        `).join('');
}

// Helper function to format timestamps
function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };
    
    for (let [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }
    return 'just now';
}

// Close modals
function closeModal() {
    document.getElementById('vibeModal').classList.add('hidden');
    document.getElementById('vibeDescription').value = '';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Modal close buttons
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('closeFilterModal').addEventListener('click', () => {
        document.getElementById('filterModal').classList.add('hidden');
    });

    // Add Vibe button
    document.getElementById('addVibeBtn').addEventListener('click', () => {
        const center = state.map.getCenter();
        showVibeModal(center);
    });

    // Heatmap toggle
    document.getElementById('heatmapToggle').addEventListener('click', (e) => {
        const isActive = state.heatmap.getMap();
        state.heatmap.setMap(isActive ? null : state.map);
        e.target.classList.toggle('bg-purple-600');
    });

    // Filter button
    document.getElementById('filterVibes').addEventListener('click', () => {
        document.getElementById('filterModal').classList.remove('hidden');
    });

    // Apply filters
    document.getElementById('applyFilters').addEventListener('click', () => {
        state.activeVibeTypes.clear();
        document.querySelectorAll('.vibe-filter:checked').forEach(checkbox => {
            state.activeVibeTypes.add(checkbox.value);
        });
        
        // Update markers visibility
        state.markers.forEach(({ marker, vibeType }) => {
            marker.setVisible(state.activeVibeTypes.has(vibeType));
        });
        
        // Update heatmap
        updateHeatmap();
        
        document.getElementById('filterModal').classList.add('hidden');
    });
});

// Initialize the map when the page loads
window.onload = initMap; 