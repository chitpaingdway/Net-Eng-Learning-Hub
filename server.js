const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'neteng-academy-secret',
    resave: false,
    saveUninitialized: true
}));

// MongoDB Connection
const dbURI = 'mongodb+srv://chitpaing:letmein2026@cluster0neteng.kznts1e.mongodb.net/NetEngDB?retryWrites=true&w=majority';
mongoose.connect(dbURI).then(() => console.log("✅ DB Connected")).catch(err => console.log("❌ DB Error:", err));

const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
}));

// Email Transport Setup
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL သုံးရန်
    auth: {
        user: 'chit.paingdway@gmail.com',
        pass: 'pbqxxqbjizrztkzs' 
    }
});

let otpStore = {};

app.post('/send-otp', async (req, res) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const email = req.body.email;
    otpStore[email] = otp;
    
    console.log(`Attempting to send OTP to: ${email}`);

    try {
        await transporter.sendMail({
            from: '"NetEng Academy" <chit.paingdway@gmail.com>',
            to: email,
            subject: "Verification Code",
            text: `Your verification code is: ${otp}`
        });
        console.log("✅ Email sent successfully");
        res.sendStatus(200);
    } catch (e) { 
        console.error("❌ Email Error:", e.message);
        res.status(500).send(e.message); 
    }
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
    } else { res.send('Invalid Login! <a href="/login.html">Try again</a>'); }
});

app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    if (!req.session.user) return res.redirect('/login.html');
    res.sendFile(path.join(__dirname, 'Public', 'index.html'), err => {
        if(err) res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
});

app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
