const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'neteng-academy-secret',
    resave: false,
    saveUninitialized: true
}));

// ၁။ MongoDB ချိတ်ဆက်ခြင်း (Replace with your link)
const dbURI = 'mongodb+srv://chitpaing:P@ssw0rd@cluster0neteng.kznts1e.mongodb.net/NetEngDB?retryWrites=true&w=majority';
mongoose.connect(dbURI).then(() => console.log("✅ DB Connected")).catch(err => console.log(err));

// User Model
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
}));

// ၂။ Email Transport (Replace with your Gmail & App Password)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'သင့်အီးမေးလ်@gmail.com',
        pass: 'သင့်ရဲ့_16_digit_app_password'
    }
});

let otpStore = {};

// --- ROUTES ---

app.post('/send-otp', async (req, res) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[req.body.email] = otp;
    try {
        await transporter.sendMail({
            from: '"NetEng Academy" <သင့်အီးမေးလ်@gmail.com>',
            to: req.body.email,
            subject: "Verification Code",
            text: `Your verification code is: ${otp}`
        });
        res.sendStatus(200);
    } catch (e) { res.status(500).send(e.message); }
});

app.post('/signup', async (req, res) => {
    const { email, otp, username, password } = req.body;
    if (otpStore[email] === otp) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await new User({ username, email, password: hashedPassword }).save();
            delete otpStore[email];
            res.send('Signup Success! <a href="/login.html">Login now</a>');
        } catch (e) { res.status(400).send("User already exists!"); }
    } else { res.status(400).send("Invalid OTP!"); }
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user;
        res.redirect('/');
    } else { res.send('Invalid Login!'); }
});

app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    if (!req.session.user) return res.redirect('/login.html');
    res.sendFile(path.join(__dirname, 'Public', 'index.html'), err => {
        if(err) res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login.html'));
});

app.listen(PORT, () => console.log(`Running on ${PORT}`));
