const router = require("express").Router();
const User = require('../models/user.model');
const Job = require('../models/job.model');
const passport = require("../config/passportConfig");

//Create Route
router.get('/create', (req, res) => {
    res.render('client/create');
});

router.post('/create', async (req, res) => {

    let jobDetails = req.body;
    jobDetails["owner"] = req.user._id;
    
    try {
        let job = Job(jobDetails);
        let saveRes = await job.save();
        res.redirect("/client/dashboard")
    } catch (error) {
        console.log(error);
    }

});

//Display
router.get("/dashboard", async (req, res) => {
    //FIND ALL JOBS TO DISPLAY
    // console.log(`Current User: ${req.user}`);
    try {
        let findRes = await Job.find({
            "owner": req.user._id
        }).populate("owner");
        // console.log(findRes);
        res.render("client/dashboard", {
            jobs: findRes
        })
    } catch (error) {

    }

});

//Edit
router.get("/edit/:id", async (req,res) => {
    //Find Job by id and display
    // res.render("client/edit",{job:findRes} )
});

router.post("/edit/:id", async (req,res) => {
    //Find Job by id and update
    res.redirect("/client/dashboard")
});

module.exports = router;