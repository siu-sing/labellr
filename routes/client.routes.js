const router = require("express").Router();
const User = require('../models/user.model');
const passport = require("../config/passportConfig");

//Register Route
router.get('/create', (req, res) => {
    res.render('client/create');
});


router.post('/create', (req, res) => {
    console.log(req.body);
});

module.exports = router;