// ===== API BASE URL =====
const API = 'http://localhost:8081/api';

// ===== GENERIC FETCH HELPERS =====
async function apiGet(endpoint) {
    const res = await fetch(`${API}${endpoint}`);
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || 'Request failed');
    }
    return res.json();
}

async function apiPost(endpoint, data) {
    const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || 'Request failed');
    }
    return res.json();
}

async function apiPut(endpoint, data) {
    const res = await fetch(`${API}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || 'Request failed');
    }
    return res.json();
}

async function apiDelete(endpoint) {
    const res = await fetch(`${API}${endpoint}`, { method: 'DELETE' });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(err.message || 'Request failed');
    }
    // might return text
    const text = await res.text();
    try { return JSON.parse(text); } catch { return text; }
}

// ===== USER APIs =====
const UserAPI = {
    register: (data) => apiPost('/users/register', data),
    login: (data) => apiPost('/users/login', data),
    getAll: () => apiGet('/users'),
    getById: (id) => apiGet(`/users/${id}`),
    update: (id,data) => apiPut(`/users/update/${id}`, data),
    delete: (id) => apiDelete(`/users/delete/${id}`)
};

// ===== UserProfile APIs =====
const UserProfileAPI = {
    createProfile: (id,data) => apiPost(`/userProfile/createProfile/${id}`, data),
    getAll: () => apiGet('/userProfile'),
    getById: (id) => apiGet(`/userProfile/${id}`),
    update: (id,data) => apiPut(`/userProfile/update/${id}`, data),
    delete: (id) => apiDelete(`/userProfile/delete/${id}`),
    getByCityName: (cityName) => apiGet(`/userProfile/${cityName}`)
};

// ===== USERSKILL APIs =====
const UserSkillAPI = {
    add: (data,id) => apiPost(`/userSkill/addSkill/${id}`, data),
    getAll: () => apiGet('/userSkill'),
    getById: (id) => apiGet(`/userSkill/${id}`),
    search: (title) => apiGet(`/movies/search?title=${encodeURIComponent(title)}`),
    getByGenre: (genre) => apiGet(`/movies/genre/${genre}`),
    getByLanguage: (lang) => apiGet(`/movies/language/${lang}`),
    update: (id, data) => apiPut(`/movies/${id}`, data),
    delete: (id) => apiDelete(`/movies/${id}`)
};

// ===== SKILL APIs =====
const SkillAPI = {
    add: (profileId,data) => apiPost(`/skill/add/${profileId}`, data),
    getAll: () => apiGet('/skill'),
    getById: (id) => apiGet(`/skill/${id}`),
    update: (id, data) => apiPut(`/skill/${id}`, data),
    delete: (id) => apiDelete(`/skill/${id}`),
    removeSkil: (profileId,skillId) => apiDelete(`/skill/delete/${profileId}/${skillId}`)
};

// ===== MESSAGE APIs =====
const MessageAPI = {
    send: (data) => apiPost('/message', data),
    getById: (id) => apiGet(`/message/${id}`),
    getConversation: (senderId,receiverId) => apiGet(`/message/getconversation/${senderId}/${receiverId}`),
    getSentMessage: (userId) => apiGet(`/message/sentmessage/${userId}`),
    getReceivedMessage: (userId) => apiGet(`/message/getReceivedMessage/${userId}`),
    getReceivedMessage: (userId) => apiGet(`/message/getReceivedMessage/${userId}`),
    getReceivedMessage: (userId) => apiGet(`/message/getReceivedMessage/${userId}`),
};

// ===== REVIEW APIs =====
const ReviewAPI = {
    create: (data) => apiPost(`/review/create`, data),
    getConversation: (reviewerId,reviewedUserId) => apiGet(`/review/getconvarsation/${reviewerId}/${reviewedUserId}`),
    getById: (id) => apiGet(`/review/${id}`),
    getAll: () => apiGet(`/review`),
    getReviewsForUser: (reviewedUserId) => apiGet(`/review/getreviews/${reviewedUserId}`),
    getReviewsByReviewer: (reviewerId) => apiGet(`/review/getreviews/${reviewerId}`),
    AverageRating: (userId) => apiGet(`/review/averageRating/${userId}`)
};

// ===== NOTIFICATION APIs =====
const NotificationAPI = {
    create: (data) => apiPost('/notification', data),
    getAll: () => apiGet('/shows'),
    getById: (id) => apiGet(`/notification/${id}`),
    getByUserId: (userId) => apiGet(`/notification/byuser/${userId}`),
    unreadNotification: (userId) => apiGet(`/notification/unreadNotification/${userId}`),
    markAsRead: (id) => apiPut(`/notification/markAsRead/${id}`),
    delete: (id) => apiDelete(`/notification/delete/${id}`)
};

// ===== BOOKING APIs =====
const BookingAPI = {
    create: (data) => apiPost(`/exchangeRequest`, data),
    getById: (id) => apiGet(`/exchangeRequest/${id}`),
    getSentRequests: (userId) => apiGet(`/exchangeRequest/getsentRequests/${userId}`),
    getReceivedRequests: (userId) => apiGet(`/exchangeRequest/getreceivedRequests/${userId}`),
    acceptRequest: (requestId) => apiPut(`/exchangeRequest/accept/${requestId}`),
    rejectRequest: (requestId) => apiPut(`/exchangeRequest/reject/${requestId}`),
    completeRequest: (requestId) => apiPut(`/exchangeRequest/complete/${requestId}`)
};