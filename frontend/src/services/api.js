/**
 * Centralized API service for MPC Repairs frontend.
 * All API calls go through this module with auto JWT injection.
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

// ─── Helpers ───

function getToken() {
  return sessionStorage.getItem('adminToken');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, path, body = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...authHeaders()
  };

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, options);
  const json = await res.json();

  if (!res.ok) {
    let errorMessage = json.message || 'Request failed';
    
    if (errorMessage === 'Validation error' && json.errors && json.errors.length > 0) {
      const emailError = json.errors.find(e => e.field && e.field.toLowerCase().includes('email'));
      const phoneError = json.errors.find(e => e.field && e.field.toLowerCase().includes('phone'));
      
      const messages = [];
      if (phoneError) messages.push('Invalid phone number');
      if (emailError) messages.push('Invalid email');

      if (messages.length > 0) {
        errorMessage = messages.join(' and ');
      } else {
        errorMessage = json.errors[0].message.replace(/\"/g, '');
      }
    }

    const error = new Error(errorMessage);
    error.status = res.status;
    error.data = json;
    throw error;
  }

  return json.data !== undefined ? json.data : json;
}

const get = (path) => request('GET', path);
const post = (path, body) => request('POST', path, body);
const put = (path, body) => request('PUT', path, body);
const del = (path) => request('DELETE', path);

// ─── Public APIs ───

export const fetchCatalog = () => get('/public/catalog');

export const fetchSlots = (date) => get(`/public/slots?date=${date}`);

export const createBooking = (data) => post('/public/bookings', data);

export const fetchPublicSettings = () => get('/public/settings');

// ─── Auth APIs ───

export const loginAdmin = (email, password) =>
  post('/auth/login', { email, password });

export const logoutAdmin = () => post('/auth/logout');

// ─── Admin: Dashboard ───

export const fetchDashboardStats = () => get('/admin/dashboard/stats');

export const fetchDashboardCalendar = (startDate, endDate) => {
  return get(`/admin/dashboard/calendar?startDate=${startDate}&endDate=${endDate}`);
};

// ─── Admin: Search ───

export const globalSearch = (q) => get(`/admin/search?q=${encodeURIComponent(q)}`);

// ─── Admin: Bookings ───

export const fetchAdminBookings = (params = {}) => {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', params.page);
  if (params.limit) qs.set('limit', params.limit);
  if (params.search) qs.set('search', params.search);
  if (params.status) qs.set('status', params.status);
  if (params.startDate) qs.set('startDate', params.startDate);
  if (params.endDate) qs.set('endDate', params.endDate);
  return get(`/admin/bookings?${qs.toString()}`);
};

export const fetchBookingById = (id) => get(`/admin/bookings/${id}`);

export const createAdminBooking = (data) => post('/admin/bookings', data);

export const updateBookingStatus = (id, status) =>
  put(`/admin/bookings/${id}/status`, { status });

export const rescheduleBooking = (id, dateStr, timeSlot) =>
  put(`/admin/bookings/${id}/reschedule`, { dateStr, timeSlot });

export const deleteAdminBooking = (id) => del(`/admin/bookings/${id}`);

// ─── Admin: Notifications ───

export const fetchNotifications = () => get('/admin/notifications');

export const markNotificationRead = (id) => put(`/admin/notifications/${id}/read`);

export const clearNotifications = () => del('/admin/notifications/clear');

// ─── Admin: Store Hours ───

export const fetchStoreHours = () => get('/admin/store-hours');
export const updateStoreHours = (data) => put('/admin/store-hours', data);

// ─── Admin: Schedule Exceptions ───

export const fetchAdminExceptions = () => get('/admin/exceptions');
export const createException = (data) => post('/admin/exceptions', data);
export const updateException = (id, data) => put(`/admin/exceptions/${id}`, data);
export const deleteException = (id) => del(`/admin/exceptions/${id}`);

// ─── Admin: Settings ───

export const fetchAdminSettings = () => get('/admin/settings');
export const updateAdminSettings = (data) => put('/admin/settings', data);
export const changeAdminPassword = (currentPassword, newPassword) =>
  put('/admin/change-password', { currentPassword, newPassword });

// ─── Admin: Catalog ───

export const reloadCatalog = () => post('/admin/catalog/reload');
