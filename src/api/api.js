import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://learning.banzait.com/back',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer token`
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
