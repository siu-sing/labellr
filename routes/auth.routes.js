const router = require("express").Router();
const User = require('../models/user.model');
const passport = require("../config/passportConfig");

//Register Route
router.get('/register', (req, res) => {
    res.render('auth/register');
})

//Post and register user
router.post('/register', (req, res) => {
    console.log(req.body);
    let user = User(req.body);
    try {
        let saveRes = user.save();
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
    successRedirect: "/", //after login success
    failureRedirect: "/auth/login", //if fail
    failureFlash: "Invalid Username or Password",
    successFlash: "You have logged In!"
})
);


module.exports = router;