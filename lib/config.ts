export const API_URL = 'http://127.0.0.1:3005/api';

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};
