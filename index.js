require("dotenv").config();
const session = require('express-session');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require("passport");
const passportSetup = require('./passport');
const oAuthRoute = require('./Routes/oauth');
const authRoutes = require('./Routes/auth');
const { db } = require('./connection');

db();
const app = express();

// Middlewares
app.use(cors({
    origin: "https://login-with-oauth.netlify.app/login",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));
app.use(express.json());
app.use(bodyParser.urlencoded())
app.use(session({
    secret: "somethingsecretgoeshere",
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize())
app.use(passport.session())


app.get('/',(req,res)=>{
    res.send("<h3>Hello World</h3>")
})
//Routes
app.use('/auth', oAuthRoute)
app.use('/api', authRoutes);

//PORT
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App is listening in  port ${PORT}`);
});
