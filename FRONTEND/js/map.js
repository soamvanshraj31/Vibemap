// Mood colors mapping
const moodColors = {
    'Happy': '#FCD34D', // yellow-400
    'Chill': '#22D3EE', // cyan-400
    'Romantic': '#F87171', // red-400
    'Tense': '#FB923C', // orange-400
    'Busy': '#A78BFA'  // purple-400
};

// Mood emojis mapping
const moodEmojis = {
    'Happy': '😊',
    'Chill': '😌',
    'Romantic': '❤️',
    'Tense': '😕',
    'Busy': '😟'
};

let map;
let markers = [];
let userMarker = null;
let currentMood = null;
let heatmap = null;

// Initialize the map
function initMap() {
    // Default to San Francisco coordinates
    const defaultLocation = { lat: 37.7749, lng: -122.4194 };
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultLocation,
        zoom: 13,
        styles: [
            {
                "elementType": "geometry",
                "stylers": [{"color": "#1a1a2a"}]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [{"color": "#1a1a2a"}]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#22D3EE"}]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#22D3EE"}]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{"color": "#2a2a3a"}]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"color": "#0c1824"}]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{"color": "#1a1a2a"}]
            }
        ]
    });

    // Get user's location with loading animation
    showLoadingAnimation();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                hideLoadingAnimation();
                map.setCenter(pos);
                placeUserMarker(pos);
                showNotification('Location found! 📍');
            },
            () => {
                hideLoadingAnimation();
                showNotification('Could not get your location 😕', 'error');
                console.log('Error: The Geolocation service failed.');
            }
        );
    }

    // Load existing mood markers
    loadMoodMarkers();
    
    // Initialize heatmap
    initializeHeatmap();
}

// Show loading animation
function showLoadingAnimation() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';
    loadingDiv.className = 'fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50';
    loadingDiv.innerHTML = `
        <div class="text-center">
            <div class="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <p class="mt-4 text-cyan-400">Finding your location...</p>
        </div>
    `;
    document.body.appendChild(loadingDiv);
}

// Hide loading animation
function hideLoadingAnimation() {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 p-4 rounded-xl ${type === 'success' ? 'bg-cyan-600' : 'bg-red-600'} text-white z-50 animate-fade-in`;
    notification.innerHTML = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('animate-fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Place user's current location marker with animation
function placeUserMarker(position) {
    if (userMarker) {
        userMarker.setMap(null);
    }

    userMarker = new google.maps.Marker({
        position: position,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#22D3EE',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
        }
    });

    // Add pulse animation
    addPulseAnimation(userMarker);
}

// Add pulse animation to marker
function addPulseAnimation(marker) {
    let scale = 10;
    let growing = true;

    setInterval(() => {
        if (growing) {
            scale += 0.1;
            if (scale >= 12) growing = false;
        } else {
            scale -= 0.1;
            if (scale <= 10) growing = true;
        }

        marker.setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            scale: scale,
            fillColor: '#22D3EE',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
        });
    }, 50);
}

// Add a new mood marker with animation
function addMoodMarker(position, mood) {
    const marker = new google.maps.Marker({
        position: position,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 15,
            fillColor: moodColors[mood],
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2
        }
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div class="p-4 rounded-lg bg-gray-800 text-white">
                <div class="text-lg font-bold mb-2">${mood}</div>
                <div class="text-3xl">${moodEmojis[mood]}</div>
                <div class="text-sm text-gray-400 mt-2">Just now</div>
            </div>
        `
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });

    markers.push(marker);
    updateLeaderboard();
    updateHeatmap();
}

// Initialize heatmap
function initializeHeatmap() {
    const heatmapData = markers.map(marker => ({
        location: marker.getPosition(),
        weight: 1
    }));

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: map,
        radius: 50,
        opacity: 0.6,
        gradient: [
            'rgba(0, 0, 0, 0)',
            'rgba(34, 211, 238, 0.5)',
            'rgba(34, 211, 238, 0.8)',
            'rgba(34, 211, 238, 1)'
        ]
    });
}

// Update heatmap
function updateHeatmap() {
    if (heatmap) {
        const heatmapData = markers.map(marker => ({
            location: marker.getPosition(),
            weight: 1
        }));
        heatmap.setData(heatmapData);
    }
}

// Filter moods
function filterMoods(mood) {
    markers.forEach(marker => {
        const markerMood = marker.get('mood');
        marker.setVisible(mood === 'all' || markerMood === mood);
    });
}

// Load existing mood markers
function loadMoodMarkers() {
    const sampleMoods = [
        { position: { lat: 37.7749, lng: -122.4194 }, mood: 'Happy' },
        { position: { lat: 37.7833, lng: -122.4167 }, mood: 'Chill' },
        { position: { lat: 37.7900, lng: -122.4100 }, mood: 'Romantic' }
    ];

    sampleMoods.forEach(({ position, mood }) => {
        addMoodMarker(position, mood);
    });
}

// Update the leaderboard with animation
function updateLeaderboard() {
    const leaderboardData = [
        { place: 'Golden Gate Park', mood: 'Happy', count: 42 },
        { place: 'Fisherman\'s Wharf', mood: 'Chill', count: 38 },
        { place: 'Pier 39', mood: 'Romantic', count: 35 },
        { place: 'Union Square', mood: 'Busy', count: 30 },
        { place: 'Chinatown', mood: 'Tense', count: 25 }
    ];

    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = leaderboardData
        .map((item, index) => `
            <li class="flex items-center gap-3 bg-gray-800 p-3 rounded-xl hover:bg-gray-700 transition-all">
                <span class="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-cyan-400 font-bold">${index + 1}</span>
                <span class="flex-1 text-${getMoodColor(item.mood)}">${item.place}</span>
                <span class="text-2xl">${moodEmojis[item.mood]}</span>
                <span class="ml-2 text-cyan-400 font-bold">${item.count}</span>
            </li>
        `)
        .join('');
}

// Get mood color class
function getMoodColor(mood) {
    const colorMap = {
        'Happy': 'yellow-400',
        'Chill': 'cyan-400',
        'Romantic': 'red-400',
        'Tense': 'orange-400',
        'Busy': 'purple-400'
    };
    return colorMap[mood] || 'gray-400';
}

// Handle mood selection with animation
function selectMood(mood) {
    currentMood = mood;
    document.querySelectorAll('.mood-button').forEach(btn => {
        btn.classList.remove('ring-2', 'ring-white', 'scale-110');
    });
    const selectedButton = document.querySelector(`[data-mood="${mood}"]`);
    selectedButton.classList.add('ring-2', 'ring-white', 'scale-110');
}

// Submit mood with animation
function submitMood() {
    if (!currentMood || !userMarker) {
        showNotification('Please select a mood first! 😊', 'error');
        return;
    }

    const position = userMarker.getPosition();
    addMoodMarker(position, currentMood);
    showNotification('Vibe shared successfully! 🎉');
    
    // Reset selection
    currentMood = null;
    document.querySelectorAll('.mood-button').forEach(btn => {
        btn.classList.remove('ring-2', 'ring-white', 'scale-110');
    });
}

// Initialize the map when the page loads
window.initMap = initMap; 