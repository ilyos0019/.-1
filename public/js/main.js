const API_URL = '/api';

// --- UI Helpers ---
const showToast = (message, type = 'success') => {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    // Phosphor icons
    const icon = type === 'success' ? '<i class="ph ph-check-circle"></i>' : '<i class="ph ph-warning-circle"></i>';
    toast.innerHTML = `${icon} <span>${message}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// --- Auth Helpers ---
const setToken = (token, role) => {
    localStorage.setItem('token', token);
    if(role) localStorage.setItem('role', role);
};

const getToken = () => localStorage.getItem('token');
const getRole = () => localStorage.getItem('role');
const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login.html';
};

// Update Navbar based on auth state
const updateNavbar = () => {
    const nav = document.getElementById('navbar-links');
    if (!nav) return;
    
    const token = getToken();
    const role = getRole();
    
    if (token) {
        let links = `
            <a href="/index.html" class="nav-link">Bosh sahifa</a>
            <a href="/dashboard.html" class="nav-link">Kabinet</a>
        `;
        if (role === 'admin') {
            links += `<a href="/admin.html" class="nav-link">Admin Panel</a>`;
        }
        links += `<button onclick="logout()" class="btn btn-outline" style="padding: 0.4rem 1rem">Chiqish</button>`;
        nav.innerHTML = links;
    } else {
        nav.innerHTML = `
            <a href="/index.html" class="nav-link">Bosh sahifa</a>
            <a href="/login.html" class="nav-link">Kirish</a>
            <a href="/register.html" class="btn btn-primary" style="padding: 0.4rem 1rem">Ro'yxatdan o'tish</a>
        `;
    }
};

// --- API Wrappers ---
const fetchAPI = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        if (options.body) {
            options.body = JSON.stringify(options.body);
        }
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Xatolik yuz berdi');
        }
        return data;
    } catch (error) {
        showToast(error.message, 'error');
        throw error;
    }
};

// Init
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
});
