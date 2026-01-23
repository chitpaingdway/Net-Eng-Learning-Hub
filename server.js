const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
// Render အတွက် PORT ကို အရှင်ထားပေးရပါမယ်
const PORT = process.env.PORT || 3000; 

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'neteng-secret-key',
    resave: false,
    saveUninitialized: true
}));

const users = []; 

function checkAuth(req, res, next) {
    if (req.session.user) next();
    else res.redirect('/login.html');
}

// --- ROUTES ---

// ၁။ Signup Route
app.post('/signup', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({ username: req.body.username, password: hashedPassword });
    res.send('Account created! <a href="/login.html">Login here</a>');
});

// ၂။ Login Route
app.post('/login', async (req, res) => {
    const user = users.find(u => u.username === req.body.username);
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user;
        res.redirect('/');
    } else {
        res.send('Invalid credentials! <a href="/login.html">Try again</a>');
    }
});

// ၃။ Login Page Route (အမှားမရှိအောင် သေချာကိုင်တွယ်ထားခြင်း)
app.get('/login.html', (req, res) => {
    // ပထမဦးဆုံး 'Public' (P အကြီး) ထဲမှာ ရှာမယ်
    res.sendFile(path.join(__dirname, 'Public', 'login.html'), err => {
        if (err) {
            // ရှာမတွေ့ရင် 'public' (p အသေး) ထဲမှာ ထပ်ရှာမယ်
            res.sendFile(path.join(__dirname, 'public', 'login.html'), err2 => {
                if (err2) {
                    res.status(404).send("Login Page not found. Please check your folder name on GitHub.");
                }
            });
        }
    });
});

// ၄။ Home Page (Login ဝင်ထားမှ ပေးကြည့်မည်)
app.get('/', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'index.html'), err => {
        if (err) {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        }
    });
});

// Static Files (CSS, Images, JS)
app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', checkAuth, express.static('uploads'));

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return console.log(err);
        res.redirect('/login.html');
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
