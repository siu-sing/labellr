const router = require("express").Router();
const Job = require('../models/job.model');
const Text = require('../models/text.model');
const User = require('../models/user.model');
const {
    find
} = require("../models/job.model");

//Account Page
router.get("/account", async (req, res) => {

    try {
        let user = await User.findById(req.user._id).populate('labelJobs.job');

        //Basic User Stats
        let lifetimeLabels = 0;
        let completedJobs = 0;
        let inProgressJobs = 0;
        user.labelJobs.forEach(lj => {
            lifetimeLabels += lj.lastLabelled
            switch (lj.jobStatus) {
                case "complete":
                    completedJobs++;
                    break;
                case "inProgress":
                    inProgressJobs++;
                    break;
            }
        });

        res.render("labeller/account", {
            user: user,
            stats: {
                lifetimeLabels,
                completedJobs,
                inProgressJobs
            }
        });

    } catch (error) {
        console.log(error);
    }
});

//Display Workflows - ALL JOBS
router.get("/workflows", async (req, res) => {
    //FIND ALL AVAILABLE JOBS TO DISPLAY
    try {

        //Get All Jobs in progress
        let allJobs = await Job.find({
            status: "inProgress"
        }).populate("owner");
        console.log(allJobs);

        //Get all jobs in users's job list
        let user = await User.findById(req.user._id, "labelJobs")
        console.log(user);

        let userJobIds = [];
        user.labelJobs.forEach(labelJob => {
            userJobIds.push(labelJob.job);
        });
        //Exclude users job list from the all jobs in progress

        let jobsToDisplay = [];
        //FOREACH job in allJobs
        allJobs.forEach(job => {
            // console.log(`Comparing: ${job.jobName}`)
            // console.log(`Is In User Job list? ${isInArray(job._id,userJobIds)}`)
            //if _id doesn't match any in userJobIds, push into jobsToDisplay 
            if (!isInArray(job._id, userJobIds)) {
                jobsToDisplay.push(job);
            }
        });

        //Render the resulting list of jobs
        res.render("labeller/workflows", {
            jobs: jobsToDisplay
        })

    } catch (error) {
        console.log(error);
    }

});

//function - given an ID, and an array of IDs, return true if is found, false if not found
let isInArray = function (_id, A) {
    let isInArray = false;
    A.forEach(item => {
        if (item.equals(_id)) {
            isInArray = true;
        }
    });
    return isInArray;
}

//For sorting label jobs on dashboard
function jobStatusCompare(labelJobA, labelJobB) {
    if (labelJobA.jobStatus < labelJobB.jobStatus) {
        return 1;
    } else if (labelJobA.jobStatus > labelJobB.jobStatus) {
        return -1;
    } else {
        return 0;
    }
}

//Display Dashbord - Jobs that labeller currently working on 
router.get("/dashboard", async (req, res) => {
    //Find all jobs under user
    try {
        let user = await User.findById(req.user._id).populate('labelJobs.job')

        user.labelJobs.sort(jobStatusCompare);

        console.log(user);

        user.labelJobs.forEach(i => {
            console.log(i);
            console.log(i.job.labelType);
        })
        // res.send(user);
        res.render("labeller/dashboard", {
            user: user
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

        //Filter list of texts to include one after the last labelled text 
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

            //Show sentiment label card
            if (findRes.labelType == 'sentiment') {

                //Render only those texts
                res.render("labeller/label", {
                    job: findRes,
                    texts: textsDisplay,
                    textsLeft: textsLeft,
                    lastLabelled: lastLabelled,
                })
            //Show topic label card
            } else if (findRes.labelType == 'topic') {

                res.render("labeller/label",{
                    job: findRes,
                    texts: textsDisplay,
                    textsLeft: textsLeft,
                    lastLabelled: lastLabelled,
                })
            }
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

//When user submits a topic label
router.get("/label/job/:job_id/text/:text_id/topic/:topic_label", async (req, res) => {
    console.log(req.params.topic_label);

    try {
        let userId = req.user._id;

        //Add topic label to text object
        let topicRes = await Text.findByIdAndUpdate(req.params.text_id, {
            $push: {
                topicLabel: req.params.topic_label,
            }
        })

        //Increment lastlabelled by one
        let lastLabRes = await User.findOneAndUpdate({
            _id: userId,
            "labelJobs.job": req.params.job_id
        },{
            //increament last labelled by 1
            $inc: {
                "labelJobs.$.lastLabelled" : 1,
            }
        })

        res.redirect(`/labeller/label/${req.params.job_id}`)

    } catch (error) {
        console.log(error);
    }
});

module.exports = router;