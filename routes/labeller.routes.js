const router = require("express").Router();
const Job = require('../models/job.model');
const Text = require('../models/text.model');
const User = require('../models/user.model');
const {
    find
} = require("../models/job.model");


//Display Workflows - ALL JOBS
router.get("/workflows", async (req, res) => {
    //FIND ALL AVAILABLE JOBS TO DISPLAY
    try {
        let findRes = await Job.find({
            status: "inProgress"
        }).populate("owner");
        // console.log(findRes);
        res.render("labeller/workflows", {
            jobs: findRes
        })
    } catch (error) {
        console.log(error);
    }

});




//Display Labelling page
router.get("/label/:id", async (req, res) => {
    console.log(req.params.id)
    //Find the job
    try {
        let userId = req.user._id;
        let lastLabelled = 0;
        //Check if users list of jobs includes the job
        let findObj = await User.findById(userId, "labelJobs -_id");
        let jobExists = false;
        findObj.labelJobs.forEach((j) => {
            console.log(`Searching jobid: ${j.job}`);
            if (j.job.equals(req.params.id)) {
                jobExists = true;
                lastLabelled = j.lastLabelled;
                console.log(`inside if statmet, lastlabelled: ${j.lastLabelled}`)
            }
        });

        console.log(`JOBEXISTS: ${jobExists}`)
        console.log(`lastLabelled: ${lastLabelled}`)

        //If job does not exist in users list, push it in and update status
        if (!jobExists) {
            let updateRes = await User.findByIdAndUpdate(userId, {
                $push: {
                    labelJobs: {
                        job: req.params.id,
                        jobStatus: "inProgress",
                    }
                }
            })
            console.log(updateRes);
        }

        //Get lists of texts from Job
        let findRes = await Job.findById(req.params.id).populate("texts");
        // console.log(findRes);

        //Filter list of texts to include after the last labelled text onwards
        let textsDisplay = findRes.texts.slice(lastLabelled, lastLabelled + 1);

        let textsLeft = findRes.texts.length - lastLabelled;

        console.log(`LAST LABELLED: ${lastLabelled}`);
        console.log(`Length: ${findRes.texts.length}`);

        if (lastLabelled == findRes.texts.length) {
            //SET user job status to complete
            let lastLabRes = await User.findOneAndUpdate({
                _id: userId,
                "labelJobs.job": req.params.id
            }, {
                // SET STATUS
                $set: {
                    "labelJobs.$.jobStatus": "complete",
                }
            })

            //REDIRECT TO available workflows
            res.redirect("/labeller/workflows");
        } else {
            //Render only those texts
            res.render("labeller/label", {
                job: findRes,
                texts: textsDisplay,
                textsLeft: textsLeft,
            })
        }



    } catch (error) {
        console.log(error);
    }
});


router.get("/label/job/:job_id/text/:text_id/sentiment/:sent_score", async (req, res) => {
    // console.log(`textID ${req.params.text_id}`);
    // console.log(`sentScore ${req.params.sent_score}`);
    console.log(req.params);

    try {
        let userId = req.user._id;
        //User upon submission of sentiment
        //Push sentiment into text's sentiment list
        let sentRes = await Text.findByIdAndUpdate(req.params.text_id, {
            $push: {
                sentLabel: req.params.sent_score,
            }
        })

        let lastLabRes = await User.findOneAndUpdate({
            _id: userId,
            "labelJobs.job": req.params.job_id
        }, {
            //increment lastlabelled by 1
            $inc: {
                "labelJobs.$.lastLabelled": 1,
            }
        })

        res.redirect(`/labeller/label/${req.params.job_id}`)
        //IF user labels the last one,
        //Set jobstatus to complete
        //Redirect to available workflows
    } catch (error) {
        console.log(error);
    }



});


module.exports = router;