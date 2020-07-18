const router = require("express").Router();
const User = require('../models/user.model');
const Job = require('../models/job.model');
const passport = require("../config/passportConfig");

//Register Route
router.get('/create', (req, res) => {
    res.render('client/create');
});

router.post('/create', async (req, res) => {

    let jobDetails = req.body;
    jobDetails["owner"] = req.user._id;

    try {
        let job = Job(jobDetails);
        let saveRes = await job.save();
    } catch (error) {
        console.log(error);
    }

});

module.exports = router;