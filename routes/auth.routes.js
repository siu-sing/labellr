const router = require("express").Router();
const User = require('../models/user.model');
const passport = require("../config/passportConfig");

//Register Route
router.get('/register', (req, res) => {
    res.render('auth/register');
})

//Post and register user
router.post('/register', async (req, res) => {
    console.log(req.body);
    let user = User(req.body);
    try {
        let saveRes = await user.save();
        //Direct to login page
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
})

//-- Login Route
router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/login', passport.authenticate("local", {
    successRedirect: "/auth/loginredirect", //after login success
    failureRedirect: "/auth/login", //if fail
    failureFlash: "Invalid Email or Password",
    successFlash: "Logged in successfully."
}));

router.get('/loginredirect', (req, res) => {
    switch (req.user.userType) {
        case 0:
            res.redirect("/");
            break;
        case 1:
            res.redirect("/");
            break;
        case 2:
            res.redirect("/client/dashboard")
            break;
    }
});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged out successfully");
    res.redirect("/");
});


module.exports = router;