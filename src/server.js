import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import cors from 'cors';
import passport from 'passport';
import { OAuth2Client } from 'google-auth-library';
import db from "./models";
import bcrypt from 'bcrypt';
import session from 'express-session';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';

require('dotenv').config();

let app = express();
let client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(
    session({
        secret: "your_secret_key",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
    })
);

app.use(cors({
    origin: process.env.REACT_URL,
    credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize());
app.use(passport.session());

viewEngine(app);
initWebRoutes(app);

connectDB();

const generateRandomPassword = () => Math.random().toString(36).slice(-8);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.NODE_URL}/auth/google/callback`
}, async (token, tokenSecret, profile, done) => {
    const { id, displayName, emails, photos } = profile;
    const email = emails[0].value;
    const avatar = photos[0].value;

    try {
        let user = await db.User.findOne({ where: { email } });

        if (!user) {
            const hashedPassword = await bcrypt.hash(generateRandomPassword(), 10);

            user = await db.User.create({
                email,
                fullName: displayName,
                password: hashedPassword,
                avatar: 'https://i.pravatar.cc/300?img=2',
                registrationDate: new Date(),
                roleId: 'R2',
                status: true,
                gender: true,
                bio: '',
            });

            console.log(`Tạo user mới: ${displayName} (${email})`);
        } else {
            console.log(`User đã tồn tại: ${displayName} (${email})`);
        }

        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));
app.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    const user = {
        id: req.user.id,
        email: req.user.email,
        fullName: req.user.fullName,
        avatar: 'https://i.pravatar.cc/300?img=2',
        roleId: 'R2',
        status: true,
        gender: true,
        bio: '',
    };

    res.send(
        `<script>
            window.opener.postMessage({ user: ${JSON.stringify(user)} }, '${process.env.REACT_URL}');
            window.location = 'about:blank';
            window.close();
        </script>`
    );
});

app.post('/api/google-login', async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub, email, name } = payload;

        let user = await db.User.findOne({ where: { email } });

        if (!user) {
            const hashedPassword = await bcrypt.hash(generateRandomPassword(), 10);

            user = await db.User.create({
                email,
                fullName: name,
                password: hashedPassword,
                avatar: 'https://i.pravatar.cc/300?img=2',
                registrationDate: new Date(),
                roleId: 'R2',
                status: true,
                gender: true,
                bio: '',
            });

            console.log(`Tạo user mới: ${name} (${email})`);
        } else {
            console.log(`User đã tồn tại: ${name} (${email})`);
        }

        res.status(200).json({
            message: 'Login thành công!',
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                avatar: user.avatar,
                roleId: user.roleId,
            },
        });
    } catch (error) {
        console.error('Lỗi xác thực token:', error);
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
});


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.NODE_URL}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'photos', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails } = profile;
    const email = emails[0].value;

    try {
        let user = await db.User.findOne({ where: { email } });
        if (!user) {
            const hashedPassword = await bcrypt.hash(generateRandomPassword(), 10);
            user = await db.User.create({
                email,
                fullName: displayName,
                password: hashedPassword,
                avatar: 'https://i.pravatar.cc/300?img=2',
                registrationDate: new Date(),
                roleId: 'R2',
                status: true,
                gender: true,
                bio: '',
            });
            console.log(`Tạo user mới: ${displayName} (${email})`);
        } else {
            console.log(`User đã tồn tại: ${displayName} (${email})`);
        }
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
    const user = {
        id: req.user.id,
        email: req.user.email,
        fullName: req.user.fullName,
        avatar: req.user.avatar,
        roleId: req.user.roleId,
    };

    res.send(
        `<script>
            window.opener.postMessage({ user: ${JSON.stringify(user)} }, '${process.env.REACT_URL}');
            window.close();
        </script>`
    );
});


let port = process.env.PORT || 6060;

app.listen(port, () => {
    console.log("Backend Nodejs is running on the port: " + port);
})