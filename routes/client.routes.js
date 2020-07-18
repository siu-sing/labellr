const router = require("express").Router();
const Job = require('../models/job.model');
const Text = require('../models/text.model');

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
router.get("/edit/:id", async (req, res) => {
    //Find Job by id and display
    // console.log(req.params.id);
    try {
        let findRes = await Job.findById(req.params.id);
        console.log(findRes);
        res.render("client/edit", {
            job: findRes
        })
    } catch (error) {
        console.log(error);
    }

});

router.post("/edit/:id", async (req, res) => {
    //Find Job by id and update
    try {
        let jobDetails = req.body;
        jobDetails["owner"] = req.user._id;
        let findRes = await Job.findByIdAndUpdate(req.params.id, jobDetails)
    } catch (error) {
        console.log(error);
    }
    res.redirect("/client/dashboard")
});

//Delete
router.delete("/delete/:id", async (req, res) => {
    try {
        let deleteRes = await Job.findByIdAndDelete(req.params.id)
        res.redirect("/client/dashboard")
    } catch (error) {
        console.log(error);
    }
});


//-----TEXT CRUD
//Upload Page
router.get('/upload/text_manual', (req, res) => {
    res.render('client/upload_text_manual');
});

router.post('/upload/text_manual', (req, res) => {
    console.log(req.body);
});

module.exports = router;