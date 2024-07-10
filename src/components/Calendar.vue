<template>
  <v-app>
    <div class="app-background">
      <v-toolbar color="#011627" dark class="toolbar">
        <v-toolbar-title class="header" style="font-weight: bold;">Calendar <v-icon icon="mdi-calendar" size="small"></v-icon></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-chip-group v-model="selectedTypes" multiple class="mx-3">
          <v-chip 
            closable 
            @click="chip = false"
            v-for="eventTyp in eventTypes" 
            :key="eventTyp.value" 
            :color="eventTyp.color">
            {{ eventTyp.title }}
          </v-chip>
        </v-chip-group>

        <v-btn class="month-btn" icon @click="prevMonth"  style="margin: 5px;">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-select
          v-model="selectedMonth"
          :items="months"
          label="Month"
          class="month-select"
          hide-details
          dense
        ></v-select>
        <v-select
          v-model="selectedYear"
          :items="years"
          label="Year"
          class="year-select"
          hide-details
          dense
        ></v-select>
        <v-btn icon @click="nextMonth" style="margin: 5px;">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>

        <v-btn @click="resetFilters" class="mx-2" :style="{ backgroundColor: '#5D737E', color: '#FCFCFC' }" large>
          Reset Filters
        </v-btn>
        <v-btn @click="dialog = true" class="mx-2" :style="{ backgroundColor: '#5D737E', color: '#FCFCFC' }" large>
          Create event
        </v-btn>      
      </v-toolbar>

      <v-sheet class="calendar-container">
        <div class="calendar-style text-center">
          <div class="calendar-header">
            </div>
              <div class="calendar-body">
                <div class="calendar-grid">
                  <div v-for="(day, index) in displayedDays" :key="index" class="calendar-day">
                  <div class="day-header">{{ day.title }}</div>
                    <div class="event-grid">
                      <div v-for="event in filteredEventsByDay(day.date)" :key="event.id" class="event-item" :style="eventStyle(event)">
                        {{ event.name }} <p>{{ formatDate(event.startDate) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-sheet>

        <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Create Event</span>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="addEvent">
              <v-text-field v-model="eventName" label="Event name" required></v-text-field>
              <v-select v-model="selectedEventType" :items="eventTypes" item-text="title" item-value="value" label="Event category" required></v-select>
              <v-date-picker v-model="startDate" label="Start day" required></v-date-picker>
              <v-date-picker v-model="endDate" label="End day" required></v-date-picker>
              <v-card-actions>
                <v-btn @click="dialog = false" color="#FF3633" text>Cancel</v-btn>
                <v-btn type="submit" color="#FDFFFC">Create</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>

    </div>
    <v-footer v-if="hasFooterContent" color="#011627" app>

    </v-footer>
  </v-app>
</template>

<script>
import apiClient from '@/api/api.js';
import dayjs from 'dayjs';

export default {
  data() {
    return {
      chip: true,
      events: [],
      selectedFilters: [],
      selectedTypes: [],
      selectedEventType: [],
      dialog: false,
      eventName: '',
      eventTypes: [
        { title: 'Conference', value: '4d115ae7-ef38-45b7-baf3-8fd9e080a596', color: '#E71D36' },
        { title: 'Teaching', value: '23585758-9bdc-4d54-8b98-670c6f1dda5f', color: '#FF9F1C' },
        { title: 'Holidays', value: 'd6ef1e8d-c49f-4231-91cb-c3363a943fd8', color: '#2EC4B6' },
      ],
      startDate: null,
      endDate: null,
      value: [new Date()],
      selectedMonth: new Date().getMonth(),
      selectedYear: new Date().getFullYear().toString(),
      months: [
        { title: 'January', value: 0 },
        { title: 'February', value: 1 },
        { title: 'March', value: 2 },
        { title: 'April', value: 3 },
        { title: 'May', value: 4 },
        { title: 'June', value: 5 },
        { title: 'July', value: 6 },
        { title: 'August', value: 7 },
        { title: 'September', value: 8 },
        { title: 'October', value: 9 },
        { title: 'November', value: 10 },
        { title: 'December', value: 11 },
      ],
      years:[
        { title: '2023', value: 2023 },
        { title: '2024', value: 2024 },
        { title: '2025', value: 2025 },
        { title: '2026', value: 2026 },
      ]
    };
  },
  computed: {
    filteredEvents() {
      const selectedTypesArray = this.selectedTypes.map(type => {
        switch (type) {
          case 0:
            return "4d115ae7-ef38-45b7-baf3-8fd9e080a596";
          case 1:
            return "23585758-9bdc-4d54-8b98-670c6f1dda5f";
          case 2:
            return "d6ef1e8d-c49f-4231-91cb-c3363a943fd8";
          default:
            return null;
        }
      }).filter(Boolean);

      const eventsArray = Array.from(this.events);

      if (!Array.isArray(selectedTypesArray) || selectedTypesArray.length === 0) {
        return eventsArray;
      } else {
        const isCategorySelected = categoryId => selectedTypesArray.includes(categoryId);
        const filtered = eventsArray.filter(event => isCategorySelected(event.categoryId));
        return filtered;
      }
    },

    displayedDays() {
    const year = parseInt(this.selectedYear);
    const month = this.selectedMonth;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const displayedDays = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    displayedDays.push({ date: date.toISOString(), title: day });
  }

  return displayedDays;
},

    hasFooterContent() {
      return true; 
    },
  },
  methods: {
    prevMonth() {
      if (this.selectedMonth > 0) {
        this.selectedMonth -= 1;
      }
    },
    nextMonth() {
      if (this.selectedMonth < 11) {
        this.selectedMonth += 1;
      }
    },
    formatDate(date) {
      return dayjs(date).format('HH:mm:ss');
    },

    filteredEventsByDay(day) {
      return this.filteredEvents.filter(event => dayjs(event.startDate).isSame(day, 'day'));
    },

    getEventColor(event) {
      const eventType = this.eventTypes.find(type => type.value === event.categoryId);
      return eventType ? eventType.color : '#1976D2';
    },

    resetFilters() {
      console.log('Before reset - chip:', this.chip);
      this.chip = true;
      this.selectedTypes = [];
      console.log('After reset - chip:', this.chip);
      this.getEvents();
    },

    async addEvent() {
      try {
        const event = {
          name: this.eventName,
          categoryId: this.selectedEventType,
          startDate: this.startDate.toISOString(),
          endDate: this.endDate ? this.endDate.toISOString() : null,
        };

        console.log('Creating event:', event);
        await apiClient.createEvent(event);
        this.getEvents();
        this.dialog = false;
        this.resetForm();
      } catch (err) {
        console.error('Creating event error:', err);
      }
    },

    async getEvents() {
      try {
        const response = await apiClient.getAllEvents();
        this.events = response.map((event) => ({
          ...event,
          start: new Date(event.startDate),
          end: new Date(event.startDate),
        }));
        console.log('Successful events loading:', this.events);
      } catch (err) {
        console.error('Events loading error:', err);
      }
    },

    async deleteEvent(eventId) {
      try {
        await apiClient.deleteEvent(eventId);
        this.events = this.events.filter((event) => event.id !== eventId);
        console.log(`Event with ID ${eventId} successfully deleted.`);
      } catch (err) {
        console.error(`Error when deleting event with ID ${eventId}:`, err);
      }
    },

    eventStyle(event) {
      const eventType = this.eventTypes.find(type => type.value === event.categoryId);
      return {
        background: eventType ? eventType.color : 'grey',
        borderLeft: eventType ? `3px solid ${eventType.color}` : 'transparent',
        paddingLeft: '5px',
      };
    },

    resetForm() {
      this.eventName = '';
      this.selectedEventType = null;
      this.startDate = null;
      this.endDate = null;
    },
  },

  async mounted() {
    await this.getEvents();
  },
};
</script>



<style src="./src/assets/main.css">
 
</style>
