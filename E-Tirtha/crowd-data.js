// Temple coordinates
const templeCoordinates = {
    'golden-temple': { lat: 31.6200, lng: 74.8765 },
    'jagannath': { lat: 19.8135, lng: 85.8312 },
    'iskcon': { lat: 12.9716, lng: 77.5946 },
    'kedarnath': { lat: 30.7357, lng: 79.0667 }
};

// Initialize Google Maps
function initMap() {
    const templeClass = document.body.className.split(' ')[1];
    const coordinates = templeCoordinates[templeClass];
    
    if (!coordinates) return;

    const map = new google.maps.Map(document.getElementById('crowd-map'), {
        center: coordinates,
        zoom: 15,
        styles: [
            {
                "featureType": "all",
                "elementType": "geometry",
                "stylers": [{"color": "#242f3e"}]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [{"lightness": -80}]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#746855"}]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{"color": "#2b3544"}]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#9ca5b3"}]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [{"color": "#746855"}]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#f3d19c"}]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"color": "#17263c"}]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#515c6d"}]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [{"lightness": -20}]
            }
        ]
    });

    // Add marker for temple location
    new google.maps.Marker({
        position: coordinates,
        map: map,
        title: 'Temple Location',
        icon: {
            url: 'assets/temple-marker.png',
            scaledSize: new google.maps.Size(40, 40)
        }
    });

    // Add heatmap layer for crowd density
    const heatmapData = generateHeatmapData(coordinates);
    const heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: map,
        radius: 30
    });
}

// Generate sample heatmap data around temple coordinates
function generateHeatmapData(center) {
    const data = [];
    const numPoints = 50;
    
    for (let i = 0; i < numPoints; i++) {
        const lat = center.lat + (Math.random() - 0.5) * 0.01;
        const lng = center.lng + (Math.random() - 0.5) * 0.01;
        const weight = Math.random();
        
        data.push({
            location: new google.maps.LatLng(lat, lng),
            weight: weight
        });
    }
    
    return data;
}

// Update crowd status based on time and day
function updateCrowdStatus() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const crowdIndicator = document.querySelector('.crowd-indicator');
    const crowdText = document.querySelector('.crowd-status p');
    
    let status = 'low';
    let text = 'Current Crowd Level: Low';
    
    // Weekend crowd is generally higher
    if (day === 0 || day === 6) {
        if (hour >= 10 && hour <= 18) {
            status = 'high';
            text = 'Current Crowd Level: High (Weekend)';
        } else if (hour >= 8 && hour <= 10 || hour >= 18 && hour <= 20) {
            status = 'medium';
            text = 'Current Crowd Level: Medium (Weekend)';
        }
    } else {
        if (hour >= 11 && hour <= 16) {
            status = 'high';
            text = 'Current Crowd Level: High';
        } else if (hour >= 9 && hour <= 11 || hour >= 16 && hour <= 18) {
            status = 'medium';
            text = 'Current Crowd Level: Medium';
        }
    }
    
    crowdIndicator.className = `crowd-indicator ${status}`;
    crowdText.textContent = text;
}

// Update crowd status every 5 minutes
setInterval(updateCrowdStatus, 300000);
updateCrowdStatus(); // Initial update 