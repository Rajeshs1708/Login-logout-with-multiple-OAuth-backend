require("dotenv").config();
const session = require('express-session');
const express = require('express');
const cors = require('cors');
const passport = require("passport");
const passportSetup = require('./passport');
const oAuthRoute = require('./Routes/oauth');
const authRoutes = require('./Routes/auth');
const { db } = require('./connection');

db();
const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));
app.use(express.json());
app.use(session({ secret: "somethingsecretgoeshere" }));
app.use(passport.initialize())
app.use(passport.session())


app.get('/', (req, res) => {
    res.send("<h1>Hello World</h1>")
})
//Routes
app.use('/auth', oAuthRoute)
app.use('/api', authRoutes);

//PORT
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App is listening in  port ${PORT}`);
});
