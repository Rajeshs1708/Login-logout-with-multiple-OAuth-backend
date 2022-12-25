const express = require('express');
const router = express.Router();
const passport = require('passport');

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

router.get("/login/success", isLoggedIn, (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "Successfully Loged In",
            user: {
                id: req.user.id,
                name: req.user.displayName,
            }
        })
    } else {
        res.status(403).json({
            success: true,
            message: "Not Authorized",
        })
    }
});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    })
});

router.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect(`${process.env.CLIENT_URL}`);
    });
})

//Google 
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get("/google/callback", passport.authenticate("google", {
    successRedirect: `${process.env.CLIENT_URL}/home`,
    failureRedirect: "/login/failed",
}));

//Github
router.get("/github", passport.authenticate("github", { scope: ["profile"] }));

router.get("/github/callback", passport.authenticate("github", {
    successRedirect:`${process.env.CLIENT_URL}/home`,
    failureRedirect: "/login/failed",
}));

//Facebook
router.get("/facebook", passport.authenticate("facebook", { scope: ["profile"] }));

router.get("/facebook/callback", passport.authenticate("facebook", {
    successRedirect: `${process.env.CLIENT_URL}/home`,
    failureRedirect: "/login/failed",
}));

module.exports = router;