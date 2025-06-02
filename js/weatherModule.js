// Weather Module using data.gov.sg API
export class WeatherModule {
    constructor() {
        this.currentWeather = null;
        this.forecast = null;
        this.currentWeatherEl = document.getElementById('current-weather');
        this.forecastEl = document.getElementById('weather-forecast');
        this.BASE_URL = 'https://api.data.gov.sg/v1/environment';
    }
    
    
    async initialize() {
        try {
            await Promise.all([
                this.fetchCurrentWeather(),
                this.fetch24HourForecast(),
                this.fetch4DayForecast()
            ]);
            this.updateUI();
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.showError();
        }
    }

    async fetchCurrentWeather() {
        const [airTemp, humidity, rainfall] = await Promise.all([
            fetch(`${this.BASE_URL}/air-temperature`).then(res => res.json()),
            fetch(`${this.BASE_URL}/relative-humidity`).then(res => res.json()),
            fetch(`${this.BASE_URL}/rainfall`).then(res => res.json())
        ]);

        const pasirRisData = {
            temperature: this.findPasirRisReading(airTemp.items[0].readings, 'value'),
            humidity: this.findPasirRisReading(humidity.items[0].readings, 'value'),
            rainfall: this.findPasirRisReading(rainfall.items[0].readings, 'value')
        };

        this.currentWeather = pasirRisData;
    }

    async fetch24HourForecast() {
        const response = await fetch(`${this.BASE_URL}/24-hour-weather-forecast`);
        const data = await response.json();
        this.forecast24Hour = data.items[0];
    }

    async fetch4DayForecast() {
        const response = await fetch(`${this.BASE_URL}/4-day-weather-forecast`);
        const data = await response.json();
        this.forecast4Day = data.items[0].forecasts;
    }

    findPasirRisReading(readings, valueKey) {
        const pasirRisStation = readings.find(r => 
            r.station_id === 'S50' || // Pasir Ris station ID
            r.station_id === 'S117' || // Nearby station as fallback
            r.name?.toLowerCase().includes('pasir ris')
        );
        return pasirRisStation ? pasirRisStation[valueKey] : null;
    }

    getWeatherIcon(forecast) {
        // Map NEA weather descriptions to icons
        const weatherIcons = {
            'Thundery Showers': '⛈️',
            'Light Showers': '🌦️',
            'Showers': '🌧️',
            'Light Rain': '🌦️',
            'Cloudy': '☁️',
            'Partly Cloudy': '⛅',
            'Fair': '🌤️',
            'Fair & Warm': '☀️',
            'Windy': '💨'
        };
        
        for (const [condition, icon] of Object.entries(weatherIcons)) {
            if (forecast.toLowerCase().includes(condition.toLowerCase())) {
                return icon;
            }
        }
        return '🌤️'; // Default icon
    }

    formatTemperatureRange(low, high) {
        return `${Math.round(low)}°C - ${Math.round(high)}°C`;
    }

    updateUI() {
        // Update current weather
        if (this.currentWeather) {
            this.currentWeatherEl.innerHTML = `
                <div class="weather-now">
                    <h3>Current Weather at Pasir Ris</h3>
                    <div class="weather-grid">
                        <div class="weather-item">
                            <span class="weather-icon">🌡️</span>
                            <div class="weather-value">${this.currentWeather.temperature?.toFixed(1) || '--'}°C</div>
                            <div class="weather-label">Temperature</div>
                        </div>
                        <div class="weather-item">
                            <span class="weather-icon">💧</span>
                            <div class="weather-value">${this.currentWeather.humidity?.toFixed(0) || '--'}%</div>
                            <div class="weather-label">Humidity</div>
                        </div>
                        <div class="weather-item">
                            <span class="weather-icon">🌧️</span>
                            <div class="weather-value">${this.currentWeather.rainfall?.toFixed(1) || '0'} mm</div>
                            <div class="weather-label">Rainfall</div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Update 4-day forecast
        if (this.forecast4Day) {
            this.forecastEl.innerHTML = this.forecast4Day.map(day => `
                <div class="forecast-day">
                    <div class="forecast-date">${new Date(day.date).toLocaleDateString('en-SG', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                    <div class="forecast-icon">${this.getWeatherIcon(day.forecast)}</div>
                    <div class="forecast-temp">${this.formatTemperatureRange(day.temperature.low, day.temperature.high)}</div>
                    <div class="forecast-desc">${day.forecast}</div>
                    <div class="forecast-wind">${day.wind.speed.low}-${day.wind.speed.high} km/h ${day.wind.direction}</div>
                </div>
            `).join('');
        }
    }

    showError() {
        const errorMessage = `
            <div class="weather-error">
                <p>Unable to load weather data</p>
                <p>Please try again later</p>
            </div>
        `;
        this.currentWeatherEl.innerHTML = errorMessage;
        this.forecastEl.innerHTML = '';
    }
}