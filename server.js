const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
// Render အတွက် PORT ကို အရှင်ထားပေးရပါမယ် (PORT 3000 သက်သက်ဆိုရင် အလုပ်မလုပ်ပါ)
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

// Routes
app.post('/signup', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({ username: req.body.username, password: hashedPassword });
    res.send('Account created! <a href="/login.html">Login here</a>');
});

app.post('/login', async (req, res) => {
    const user = users.find(u => u.username === req.body.username);
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user;
        res.redirect('/');
    } else {
        res.send('Invalid credentials! <a href="/login.html">Try again</a>');
    }
});

// သင့် folder အမည်က 'Public' (P အကြီး) ဖြစ်နေလို့ path.join မှာ အကြီးပြောင်းပေးရပါမယ်
app.get('/', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

// Static files တွေအတွက်လည်း 'Public' (P အကြီး) သုံးပေးပါ
app.use(express.static(path.join(__dirname, 'Public')));
app.use('/uploads', checkAuth, express.static('uploads'));

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return console.log(err);
        res.redirect('/login.html');
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
