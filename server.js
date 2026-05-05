const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'usta-top-v2-super-secret-key'; // Normally from env

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public', 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// In-Memory Data Storage
let users = [];
let workers = [];
let reviews = [];
let currentWorkerId = 1;
let currentReviewId = 1;

// Initial Setup: Create Admin User
const setupAdmin = async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    users.push({
        id: 1,
        name: 'Admin',
        email: 'admin@usta.uz',
        password: hashedPassword,
        role: 'admin'
    });
    console.log('Admin user created: admin@usta.uz / admin123');
};
setupAdmin();

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Avtorizatsiya talab qilinadi' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Yaroqsiz token' });
        req.user = user;
        next();
    });
};

const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Ruxsat etilmagan! Faqat adminlar uchun.' });
    }
    next();
};

// --- API Endpoints ---

// 1. Auth API
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Barcha maydonlarni to'ldiring" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Parol kamida 6ta belgi bo'lishi kerak" });
        }
        
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ message: "Bu email ro'yxatdan o'tgan" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = {
            id: users.length + 1,
            name,
            email,
            password: hashedPassword,
            role: 'user'
        };
        users.push(newUser);
        
        const token = jwt.sign({ id: newUser.id, role: newUser.role, email: newUser.email }, SECRET_KEY, { expiresIn: '1d' });
        res.status(201).json({ message: "Muvaffaqiyatli ro'yxatdan o'tdingiz", token });
    } catch (err) {
        res.status(500).json({ message: 'Server xatosi', error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Email yoki parol xato' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Email yoki parol xato' });
        }

        const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, SECRET_KEY, { expiresIn: '1d' });
        res.json({ message: 'Tizimga kirdingiz', token, role: user.role });
    } catch (err) {
        res.status(500).json({ message: 'Server xatosi', error: err.message });
    }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    
    // omit password
    const { password, ...userInfo } = user;
    res.json(userInfo);
});

app.post('/api/auth/password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Yangi parol kamida 6ta belgi bo'lishi kerak" });
        }

        const user = users.find(u => u.id === req.user.id);
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Joriy parol xato' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        res.json({ message: "Parol muvaffaqiyatli o'zgartirildi" });
    } catch (err) {
        res.status(500).json({ message: 'Server xatosi', error: err.message });
    }
});

// Helper for worker calculations
const calculateWorkerStats = (workerId) => {
    const workerReviews = reviews.filter(r => r.workerId === workerId);
    const reviewCount = workerReviews.length;
    let avgRating = 0;
    if (reviewCount > 0) {
        const sum = workerReviews.reduce((acc, curr) => acc + curr.rating, 0);
        avgRating = Number((sum / reviewCount).toFixed(1));
    }
    return { reviewCount, avgRating };
};

// 2. Workers API
app.get('/api/workers', (req, res) => {
    const { profession, search } = req.query;
    let filteredWorkers = [...workers];

    if (profession) {
        filteredWorkers = filteredWorkers.filter(w => w.profession === profession);
    }
    
    if (search) {
        const searchLower = search.toLowerCase();
        filteredWorkers = filteredWorkers.filter(w => 
            w.name.toLowerCase().includes(searchLower) || 
            w.address.toLowerCase().includes(searchLower)
        );
    }

    const workersWithStats = filteredWorkers.map(w => {
        const stats = calculateWorkerStats(w.id);
        return { ...w, ...stats };
    });

    res.json(workersWithStats);
});

app.get('/api/workers/professions', (req, res) => {
    const professions = [...new Set(workers.map(w => w.profession))];
    res.json(professions);
});

app.get('/api/workers/:id', (req, res) => {
    const worker = workers.find(w => w.id === parseInt(req.params.id));
    if (!worker) return res.status(404).json({ message: 'Usta topilmadi' });
    
    const stats = calculateWorkerStats(worker.id);
    res.json({ ...worker, ...stats });
});

// Admin Workers CRUD
app.post('/api/workers', authenticateToken, requireAdmin, upload.single('image'), (req, res) => {
    const { name, profession, address, phone, bio } = req.body;
    if (!name || !profession) {
        return res.status(400).json({ message: 'Ism va kasb majburiy' });
    }

    const newWorker = {
        id: currentWorkerId++,
        name,
        profession,
        address: address || '',
        phone: phone || '',
        bio: bio || '',
        imageUrl: req.file ? `/uploads/${req.file.filename}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=150`,
        createdAt: new Date().toISOString()
    };
    
    workers.push(newWorker);
    res.status(201).json({ message: "Usta qo'shildi", worker: newWorker });
});

app.put('/api/workers/:id', authenticateToken, requireAdmin, upload.single('image'), (req, res) => {
    const id = parseInt(req.params.id);
    const index = workers.findIndex(w => w.id === id);
    
    if (index === -1) return res.status(404).json({ message: 'Usta topilmadi' });

    const worker = workers[index];
    const { name, profession, address, phone, bio } = req.body;
    
    if (name) worker.name = name;
    if (profession) worker.profession = profession;
    if (address !== undefined) worker.address = address;
    if (phone !== undefined) worker.phone = phone;
    if (bio !== undefined) worker.bio = bio;
    if (req.file) worker.imageUrl = `/uploads/${req.file.filename}`;
    
    workers[index] = worker;
    res.json({ message: 'Usta yangilandi', worker });
});

app.delete('/api/workers/:id', authenticateToken, requireAdmin, (req, res) => {
    const id = parseInt(req.params.id);
    const index = workers.findIndex(w => w.id === id);
    if (index === -1) return res.status(404).json({ message: 'Usta topilmadi' });
    
    workers.splice(index, 1);
    // Delete reviews associated with worker
    reviews = reviews.filter(r => r.workerId !== id);
    
    res.json({ message: "Usta o'chirildi" });
});

// 3. Reviews API
app.get('/api/workers/:id/reviews', (req, res) => {
    const workerId = parseInt(req.params.id);
    const workerReviews = reviews.filter(r => r.workerId === workerId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Add user details to reviews
    const reviewsWithUsers = workerReviews.map(r => {
        const user = users.find(u => u.id === r.userId);
        return {
            ...r,
            userName: user ? user.name : "Noma'lum foydalanuvchi"
        };
    });

    res.json(reviewsWithUsers);
});

app.post('/api/workers/:id/reviews', authenticateToken, (req, res) => {
    const workerId = parseInt(req.params.id);
    const { rating, text } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Baho 1 dan 5 gacha bo'lishi kerak" });
    }

    const worker = workers.find(w => w.id === workerId);
    if (!worker) return res.status(404).json({ message: 'Usta topilmadi' });

    const existingReview = reviews.find(r => r.workerId === workerId && r.userId === req.user.id);
    if (existingReview) {
        return res.status(400).json({ message: 'Siz allaqachon bu ustaga izoh qoldirgansiz' });
    }

    const newReview = {
        id: currentReviewId++,
        workerId,
        userId: req.user.id,
        rating: parseInt(rating),
        text: text || '',
        createdAt: new Date().toISOString()
    };
    
    reviews.push(newReview);
    res.status(201).json({ message: 'Izoh saqlandi', review: newReview });
});

app.delete('/api/workers/:id/reviews/:reviewId', authenticateToken, (req, res) => {
    const workerId = parseInt(req.params.id);
    const reviewId = parseInt(req.params.reviewId);
    
    const index = reviews.findIndex(r => r.id === reviewId && r.workerId === workerId);
    if (index === -1) return res.status(404).json({ message: 'Izoh topilmadi' });
    
    const review = reviews[index];
    
    // Only author or admin can delete
    if (review.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Ruxsat etilmagan' });
    }
    
    reviews.splice(index, 1);
    res.json({ message: "Izoh o'chirildi" });
});

// 4. Stats API
app.get('/api/stats', authenticateToken, requireAdmin, (req, res) => {
    const professionsCount = workers.reduce((acc, w) => {
        acc[w.profession] = (acc[w.profession] || 0) + 1;
        return acc;
    }, {});

    res.json({
        totalWorkers: workers.length,
        totalUsers: users.length,
        totalReviews: reviews.length,
        workersByProfession: professionsCount
    });
});

// Catch-all route to serve index.html for SPA feeling or direct page links
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: 'API topilmadi' });
    }
    // If it has an extension (like .png, .js, .css), return 404 instead of index.html
    if (req.path.includes('.')) {
        return res.status(404).send('Fayl topilmadi');
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
