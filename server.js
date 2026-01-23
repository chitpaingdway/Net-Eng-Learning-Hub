const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin User အတွက် အချက်အလက်
const ADMIN_USER = "admin";
const ADMIN_PASS = "letmein"; 

// Signup လုပ်မည့် user များ သိမ်းရန် (Server restart ဖြစ်လျှင် ပျက်ပါမည်)
// ဤနေရာတွင် တစ်ကြိမ်သာ ကြေညာထားပါသည်
const users = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'neteng-academy-secret',
    resave: false,
    saveUninitialized: true
}));

// Login စစ်ဆေးသည့် Middleware
function checkAuth(req, res, next) {
    if (req.session.user) next();
    else res.redirect('/login.html');
}

// PDF ဖိုင်များအတွက် လမ်းကြောင်းဖွင့်ပေးခြင်း
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ROUTES ---

app.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({ username: req.body.username, password: hashedPassword });
        res.send('Account created! <a href="/login.html">Login here</a>');
    } catch {
        res.status(500).send("Error creating account");
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // ၁။ Admin အကောင့်ကို အရင်စစ်ဆေးမည်
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        req.session.user = { username: ADMIN_USER };
        return res.redirect('/');
    }

    // ၂။ တခြား Signup လုပ်ထားသည့် user များကို စစ်ဆေးမည်
    const user = users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = user;
        res.redirect('/');
    } else {
        res.send('Invalid Login! <a href="/login.html">Try again</a>');
    }
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'login.html'), err => {
        if (err) res.sendFile(path.join(__dirname, 'public', 'login.html'));
    });
});

app.get('/', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'index.html'), err => {
        if (err) res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
});

// Static Files (CSS, JS)
app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login.html'));
});

app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
