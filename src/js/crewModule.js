// Crew Management Module
export class CrewModule {
    constructor() {
        this.crewMembers = [];
        this.events = [];
        this.crewMembersEl = document.getElementById('crew-members');
        this.upcomingEventsEl = document.getElementById('upcoming-events');
    }
    initialize() {
        // Load mock data for demonstration
        this.loadMockData();
        this.updateUI();
    }

    loadMockData() {
        this.crewMembers = [
            { id: 1, name: 'Alex', events: 5, location: 'Venice Beach' },
            { id: 2, name: 'Sam', events: 3, location: 'Santa Monica' }
        ];

        this.events = [
            {
                id: 1,
                title: 'Monthly Beach Cleanup',
                date: '2025-06-15',
                location: 'Venice Beach',
                participants: 12
            }
        ];
    }

    addCrewMember(member) {
        this.crewMembers.push({
            id: Date.now(),
            ...member
        });
        this.updateUI();
    }

    addEvent(event) {
        this.events.push({
            id: Date.now(),
            participants: 1,
            ...event
        });
        this.updateUI();
    }

    joinEvent(eventId, memberId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            event.participants++;
            this.updateUI();
        }
    }

    updateUI() {
        this.renderCrewMembers();
        this.renderUpcomingEvents();
    }

    renderCrewMembers() {
        this.crewMembersEl.innerHTML = this.crewMembers
            .map(member => `
                <div class="crew-member-card">
                    <h3>${member.name}</h3>
                    <p>Events Participated: ${member.events}</p>
                    <p>Location: ${member.location}</p>
                </div>
            `).join('');
    }

    renderUpcomingEvents() {
        this.upcomingEventsEl.innerHTML = `
            <h3>Upcoming Events</h3>
            ${this.events.map(event => `
                <div class="event-card">
                    <h4>${event.title}</h4>
                    <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
                    <p>Location: ${event.location}</p>
                    <p>Participants: ${event.participants}</p>
                </div>
            `).join('')}
        `;
    }
}