// Map Module
export class MapModule {
    constructor() {
        this.map = null;
        this.markers = [];
        this.cleanupEvents = [];
    }

    initialize() {
        // Set up the initMap function in the global scope
        window.initMap = () => {
            this.createMap();
        };
        
        // If Google Maps is already loaded, create the map immediately
        if (window.google && window.google.maps) {
            this.createMap();
        }
    }

    createMap() {
        const mapElement = document.getElementById('map-element');
        if (!mapElement) {
            console.error('Map element not found');
            return;
        }

        // Create the map instance
        this.map = new google.maps.Map(mapElement, {
            zoom: window.mapConfig.mapsOptions.zoom,
            center: window.mapConfig.mapsOptions.center,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: true,
            mapTypeControl: true,
            styles: [
                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [
                        { color: "#1a96cc" }
                    ]
                }
            ]
        });

        // Add cleanup location marker
        const cleanupMarker = new google.maps.Marker({
            position: window.mapConfig.mapsOptions.center,
            map: this.map,
            title: 'Next Cleanup: Pasir Ris',
            animation: google.maps.Animation.DROP
        });

        // Add info window for the marker
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="map-info-window">
                    <h3>Next Cleanup: Pasir Ris</h3>
                    <p>Location: Street View Asia</p>
                    <p>Join us on June 15, 2025</p>
                </div>
            `
        });

        cleanupMarker.addListener('click', () => {
            infoWindow.open(this.map, cleanupMarker);
        });

        // Open info window by default
        infoWindow.open(this.map, cleanupMarker);
    }

    addMarker(location, properties = {}) {
        const marker = new google.maps.Marker({
            position: location,
            map: this.map,
            title: properties.title || 'Beach Cleanup'
        });
        
        if (properties.info) {
            const infoWindow = new google.maps.InfoWindow({
                content: properties.info
            });
            
            marker.addListener('click', () => {
                infoWindow.open(this.map, marker);
            });
        }
        
        this.markers.push(marker);
        return marker;
    }

    updateMapCenter(lat, lng) {
        if (this.map) {
            this.map.panTo({ lat, lng });
        }
    }
}