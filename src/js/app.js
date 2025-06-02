import { MapModule } from './mapModule.js';
import { WeatherModule } from './weatherModule.js';
import { CrewModule } from './crewModule.js';

class ShoreSquadApp {
    constructor() {
        this.map = new MapModule();
        this.weather = new WeatherModule();
        this.crew = new CrewModule();
        this.userLocation = null;
    }

    async initialize() {
        await this.initializeGeolocation();
        this.map.initialize();
        this.crew.initialize();
        await this.weather.initialize(); // Initialize weather module

        this.setupEventListeners();
    }

    async initializeGeolocation() {
        if ('geolocation' in navigator) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true
                    });
                });

                this.userLocation = [position.coords.longitude, position.coords.latitude];
                return true;
            } catch (error) {
                console.warn('Geolocation error:', error);
                return false;
            }
        }
        return false;
    }

    setupEventListeners() {
        // Global event handlers
        document.addEventListener('cleanup:joined', (e) => {
            const { eventId, memberId } = e.detail;
            this.crew.joinEvent(eventId, memberId);
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new ShoreSquadApp();
    app.initialize().catch(console.error);
});