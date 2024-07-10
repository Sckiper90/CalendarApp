import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://learning.banzait.com/back',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJQb3J0YWwvdXNlcm5hbWUiOiJOaWtpdGFCb3lrbyIsIlBvcnRhbC91c2VyaWQiOiI1NzcyODgzZS0xZTBkLTRiZTctYWZiNS04OGExM2IxOGRiNjIiLCJqdGkiOiIwZDllM2IzZi00ZGU3LTRjY2ItOWI3Mi0wMTVjNzVhNTdiZGEiLCJQb3J0YWwvdG9rZW52ZXJzaW9uIjoiMSIsIlBvcnRhbC9jb250YWN0aWQiOiI0ZDc1Yzg3OC02MDE0LTQzYTEtYjk3Ny0xYjE0ZTg5YTFkZTUiLCJQb3J0YWwvbW9kaWZpZWRvbiI6IjYzODU1NjAxMjQ5MjgzNzg5NiIsImV4cCI6MTcyMDg2ODQ0OSwiaXNzIjoiTGVhcm5pbmciLCJhdWQiOiJMZWFybmluZyBjbGllbnQifQ.QXddARH8qwsrqNgYUSSaHR8IDMc_Fk0WCF6OvmS9gOs`
    }
});

export default {
    getAllEvents() {
        return apiClient.get('/api/Event/All')
            .then(response => {
                console.log(response.data);
                return response.data;
            })
            .catch(error => {
                console.error('Ошибка при получении событий:', error);
                throw error;
            });
    },

    createEvent(eventData) {
        return apiClient.post('/api/Event/Create', eventData)
            .then(response => {
                console.log(response.data);
                return response.data;
            })
            .catch(error => {
                console.error('Ошибка при создании события:', error);
                throw error;
            });
    },
    // deleteEvent(eventId) {
    //     return axios.delete(`/api/Event/Delete/${eventId}`)
    //       .then(response => response.data)
    //       .catch(error => {
    //         throw new Error(`API ${error}`);
    //       });
    //   }
};
