const express = require('express');
const router = express.Router();
const passport = require('passport');
const CLIENT_URL = "https://login-with-oauth.netlify.app/login"

// function isLoggedIn(req, res, next) {
//     req.user ? next() : res.sendStatus(401);
// }

router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).send({
            success: true,
            message: "Successfully Loged In",
            user: {
                id: req.user.id,
                name: req.user.displayName,
            }
        })
    } else {
        res.status(403).send({
            success: true,
            message: "Not Authorized",
        })
    }
});

router.get("/login/failed", (req, res) => {
    res.status(401).send({
        success: false,
        message: "failure",
    })
});

router.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect(CLIENT_URL);
    });
})

//Google 
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login/failed" }),
    function (req, res) {
        res.redirect("https://login-with-oauth.netlify.app")
    }
);

//Github
router.get("/github", passport.authenticate("github", { scope: ["profile"] }));

router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/login/failed" }),
    function (req, res) {
        res.redirect("https://login-with-oauth.netlify.app")
    }
);

//Facebook
router.get("/facebook", passport.authenticate("facebook", { scope: ["profile"] }));

router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login/failed" }),
    function (req, res) {
        res.redirect("https://login-with-oauth.netlify.app")
    }
);

module.exports = router;