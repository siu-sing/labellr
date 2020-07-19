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
    //Find the job
    try {
        let userId = req.user._id;
        let lastLabelled = 0;
        
        //Check if users list of jobs includes the job
        let findObj = await User.findById(userId, "labelJobs -_id");
        
        let jobExists = false;
        findObj.labelJobs.forEach((j) => {
            if (j.job.equals(req.params.id)) {
                jobExists = true;
                lastLabelled = j.lastLabelled;
            }
        });

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
            console.log("User taking on new job")
        }

        //Get lists of texts from Job to display
        let findRes = await Job.findById(req.params.id).populate("texts");

        //Filter list of texts to include after the last labelled text onwards
        let textsDisplay = findRes.texts.slice(lastLabelled, lastLabelled + 1);

        //Get number of texts left to label
        let textsLeft = findRes.texts.length - lastLabelled;

        //If there are no more to label, update status and redirect to dashboard
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

            //Redirect back to dashboard
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

//When user submits a sentiment label
router.get("/label/job/:job_id/text/:text_id/sentiment/:sent_score", async (req, res) => {

    try {
        let userId = req.user._id;
        
        //Add sentiment score to text object
        let sentRes = await Text.findByIdAndUpdate(req.params.text_id, {
            $push: {
                sentLabel: req.params.sent_score,
            }
        })

        //Increment lastlabelled by one
        let lastLabRes = await User.findOneAndUpdate({
            _id: userId,
            "labelJobs.job": req.params.job_id
        }, {
            //increment lastlabelled by 1
            $inc: {
                "labelJobs.$.lastLabelled": 1,
            }
        })

        //Redirect back to same page, but with new text to label
        res.redirect(`/labeller/label/${req.params.job_id}`)

    } catch (error) {
        console.log(error);
    }

});


module.exports = router;