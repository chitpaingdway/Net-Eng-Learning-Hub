const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Temporary Storage (Server restart ဖြစ်ရင် ပျက်ပါမည်)
const users = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'neteng-academy-secret',
    resave: false,
    saveUninitialized: true
}));

// Authentication Middleware
function checkAuth(req, res, next) {
    if (req.session.user) next();
    else res.redirect('/login.html');
}

// --- ROUTES ---

app.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({ 
            username: req.body.username, 
            password: hashedPassword 
        });
        res.send('Account created! <a href="/login.html">Login here</a>');
    } catch {
        res.status(500).send("Error creating account");
    }
});

app.post('/login', async (req, res) => {
    const user = users.find(u => u.username === req.body.username);
    if (user && await bcrypt.compare(req.body.password, user.password)) {
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

app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login.html'));
});

app.listen(PORT, () => console.log(`🚀 Back to basics running on ${PORT}`));
