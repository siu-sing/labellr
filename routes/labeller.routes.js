const router = require("express").Router();
const Job = require('../models/job.model');
const Text = require('../models/text.model');


//Display Workflows - ALL JOBS
router.get("/workflows", async (req, res) => {
    //FIND ALL AVAILABLE JOBS TO DISPLAY
    try {
        let findRes = await Job.find({status:"inProgress"}).populate("owner");
        // console.log(findRes);
        res.render("labeller/dashboard", {
            jobs: findRes
        })
    } catch (error) {
        console.log(error);
    }

});

//Display Labelling page
router.get("/label/:id", async (req, res) => {
    res.send("LABEL DATA PAGE")
});


module.exports = router;

