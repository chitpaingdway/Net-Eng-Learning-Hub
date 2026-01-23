const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'neteng-secret-key',
    resave: false,
    saveUninitialized: true
}));

// အစမ်းသုံးရန် User ဒေတာ (တကယ်တမ်းမှာ Database နဲ့ ချိတ်ရမှာပါ)
const users = []; 

// Login စစ်ဆေးသော Middleware
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

// Main Page ကို Login ဝင်ထားမှ ပေးကြည့်မယ်
app.get('/', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static('public'));
app.use('/uploads', checkAuth, express.static('uploads'));

// Logout လုပ်ရန် လမ်းကြောင်း
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        // Session ဖျက်ပြီးရင် Login Page ကို ပြန်ပို့မယ်
        res.redirect('/login.html');
    });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));