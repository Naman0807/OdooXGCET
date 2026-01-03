import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  signUp: (data) => api.post('/auth/signup', data),
  signIn: (data) => api.post('/auth/signin', data),
};

// Employee endpoints
export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employees/${id}`),
  getMe: () => api.get('/employees/me'),
  update: (id, data) => api.put(`/employees/${id}`, data),
};

// Attendance endpoints
export const attendanceAPI = {
  checkIn: () => api.post('/attendance/checkin'),
  checkOut: () => api.post('/attendance/checkout'),
  getMyAttendance: () => api.get('/attendance/my'),
  getAll: () => api.get('/attendance/all'),
};

// Leave endpoints
export const leaveAPI = {
  apply: (data) => api.post('/leave/apply', data),
  getMyLeaves: () => api.get('/leave/my'),
  getPending: () => api.get('/leave/pending'),
  approve: (id, data) => api.put(`/leave/${id}/approve`, data),
  reject: (id, data) => api.put(`/leave/${id}/reject`, data),
};

// Payroll endpoints
export const payrollAPI = {
  getMyPayroll: () => api.get('/payroll/my'),
  getAll: () => api.get('/payroll/all'),
};

export default api;