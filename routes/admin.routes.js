const router = require("express").Router();
const Job = require('../models/job.model');
const User = require('../models/user.model');
const Text = require('../models/text.model');
const mongoose = require("mongoose");


let getSummaryUsers = async function () {
    try {
        let total = await User.count();
        let summ = await User.aggregate([{
            $group: {
                _id: "$userType",
                count: {
                    $sum: 1
                }
            }
        }]);
        return {
            total,
            summ
        };
    } catch (error) {
        console.log(error);
    }

};

let getUserTypeName = function (userType) {
    let name = "";
    switch (userType) {
        case 0:
            name = "Admin"
            break;
        case 1:
            name = "Labeller"
            break;
        case 2:
            name = "Client"
            break;
    }
    return name;
}

router.get("/dashboard", async (req, res) => {
    //FIND ALL JOBS TO DISPLAY
    // console.log(`Current User: ${req.user}`);
    try {

        //Get Jobs Info
        let jobs = await Job.find().populate("owner");

        //Get User Summary
        let userSumm = await getSummaryUsers();
        userSumm.summ.forEach(type => {
            type._id = getUserTypeName(type._id);
        })

        //Get All Users
        let users = await User.find();
        // console.log(users);

        res.render("admin/dashboard", {
            jobs: jobs,
            userSumm: userSumm,
            users: users
        })
    } catch (error) {

    }

});

//Delete
router.delete("/delete/:job_id", async (req, res) => {
    try {
        //Delete texts that are linked to the jobs
        //Pull out texts from jobs and populate
        let job = await Job.findById(req.params.job_id, "texts").populate("texts");
        // console.log(job.texts);

        //Foreach text in text job, findbyid and delete
        job.texts.forEach(async (text) => {
            console.log(text);
            let deleteRes = await Text.findByIdAndDelete(text);
        });

        //Pull relevant labelJob from the labelJobs for users who signed on for the job
        // match users with the job, look into their label jobs and pull where job=job id

        let updateRes = await User.update({
        }, {
            $pull: {
                labelJobs: {
                    job: req.params.job_id
                }
            }
        }, {
            multi: true
        });

        // console.log(`RESULT OF UPDATE: ${updateRes}`)

        //Finally delete Job
        let deleteRes = await Job.findByIdAndDelete(req.params.job_id)
        res.redirect("/admin/dashboard")
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;

//To replicate error
//Client Create workflow
//Labeller take on job and start labelling
//Admin logs on and delete the workflow
//Labeller logs on and tries to view dashboard