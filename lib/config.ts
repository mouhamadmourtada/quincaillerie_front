export const API_URL = 'quincaillerie_back.mcarred.sn:8000/api';

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};
