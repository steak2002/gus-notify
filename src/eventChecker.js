const axios = require('axios');
const { addDays, format } = require('date-fns');

class EventChecker {
  constructor() {
    this.baseUrl = 'https://www.vinterbadbryggen.com/api/activity/event/days';
  }

  async getGusEvents(daysAhead = 30) {
    try {
      // Get events for the specified number of days ahead
      const fromDate = new Date();
      const toDate = addDays(fromDate, daysAhead);
      
      const fromOffset = format(fromDate, "yyyy-MM-dd'T'00:00:00.000'Z'");
      const toTime = format(toDate, "yyyy-MM-dd'T'21:59:59.999'Z'");
      
      const url = `${this.baseUrl}?eventsToShow=300&fromOffset=${fromOffset}&toTime=${toTime}`;
      
      console.log(`Fetching events from: ${url}`);
      
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'GusNotifier/1.0'
        }
      });
      
      // Extract all events from all days
      const allEvents = [];
      
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach(day => {
          if (day.slots && Array.isArray(day.slots)) {
            day.slots.forEach(event => {
              // Filter for gus events (case insensitive)
              if (this.isGusEvent(event)) {
                allEvents.push({
                  ...event,
                  date: day.date
                });
              }
            });
          }
        });
      }
      
      console.log(`Found ${allEvents.length} gus events`);
      return allEvents;
      
    } catch (error) {
      console.error('Error fetching events:', error.message);
      throw error;
    }
  }

  isGusEvent(event) {
    const name = (event.name || '').toLowerCase();
    const location = (event.locationName || '').toLowerCase();
    
    // Check if event name or location contains "gus"
    return name.includes('gus') || location.includes('gus');
  }
}

module.exports = EventChecker;
