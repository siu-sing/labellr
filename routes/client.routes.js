const router = require("express").Router();
const mongoose = require("mongoose");
const Job = require('../models/job.model');
const Text = require('../models/text.model');
const User = require('../models/user.model');
const multer = require('multer');
const upload = multer({
    dest: 'tmp/csv/'
});
const csv = require('fast-csv');
const fs = require('fs');
const {
    runInNewContext
} = require("vm");



//------ JOB CRUD
//Create Route
router.get('/create', (req, res) => {
    res.render('client/create');
});

router.post('/create', async (req, res) => {

    let jobDetails = req.body;
    jobDetails["owner"] = req.user._id;

    console.log(jobDetails);

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
        }).populate("owner")
        .sort({status: -1});
        console.log(findRes[0]);
        res.render("client/dashboard", {
            jobs: findRes
        })
    } catch (error) {
        console.log(error);
    }

});

//Edit
router.get("/edit/:id", async (req, res) => {
    //Find Job by id and display
    // console.log(req.params.id);
    try {
        let findRes = await Job.findById(req.params.id);
        // console.log(findRes);
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

//Show One
router.get("/view/:id", async (req, res) => {
    try {
        let job = await Job.findById(req.params.id).populate("owner texts");
        console.log(req.params.id)

        //Generate summary stats for job
        let numLabellers = await User.aggregate([{
                $unwind: '$labelJobs'
            },
            {
                $match: {
                    'labelJobs.job': new mongoose.Types.ObjectId(req.params.id)
                }
            },
            {
                $group: {
                    _id: '$labelJobs.jobStatus',
                    "total": {
                        "$sum": 1
                    }
                }
            },
            {
                $project: {
                    "_id": 0,
                    "jobStatus": "$_id",
                    "total": 1,
                }
            },
            {
                $sort: {
                    jobStatus: -1
                },
            }
        ])

        let labellerStats = {};
        numLabellers.forEach(res => {
            labellerStats[res.jobStatus] = res.total;
        });


        //Generate summary stats for labels
        //get length of sentLabel > job.numLabels
        let numLabelledData = 0;
        let numUsefulData = 0;
        job.texts.forEach(text => {
            if (text.sentLabel.length >= job.numLabels) {
                numLabelledData++;
            }
            if (areLabelsDecisive(text.sentLabel)) {
                numUsefulData++;
            }
        });

        console.log(labellerStats);

        res.render("client/view", {
            job: job,
            labellerStats: labellerStats,
            dataStats: {
                numLabelledData,
                numUsefulData
            }
        })
    } catch (error) {
        console.log(error);
    }
});

//function - given array of sent scores,
//check if more than half the labels are in the same half        
let areLabelsDecisive = function (A) {
    let neg = 0;
    let pos = 0;
    let neu = 0;
    A.forEach(s => {
        if (s > 3) {
            pos++;
        } else if (s < 3) {
            neg++;
        } else if (s == 3) {
            neu++;
        }
    });
    //SentLabels must have min of 3, If any of the sentiments have "majority", then labels are decisive
    if (A.length >= 3 && (pos > (A.length / 2) || neg > (A.length / 2) || neu > (A.length / 2))) {
        return true;
    } else {
        return false;
    }
}

//Publish - change status from notStarted to inProgress 
router.get("/publish/:id", async (req, res) => {
    try {
        let updateRes = await Job.findByIdAndUpdate(req.params.id, {
            status: "inProgress"
        });
        res.redirect("/client/dashboard");
    } catch (error) {
        console.log(error);
    }
});

//Close - change status from inProgres to closed
router.get("/close/:id", async (req, res) => {
    try {
        let updateRes = await Job.findByIdAndUpdate(req.params.id, {
            status: "closed"
        });
        res.redirect("/client/dashboard");
    } catch (error) {
        console.log(error);
    }
});

// //Delete
// router.delete("/delete/:id", async (req, res) => {
//     try {
//         let deleteRes = await Job.findByIdAndDelete(req.params.id)
//         res.redirect("/client/dashboard")
//     } catch (error) {
//         console.log(error);
//     }
// });

//-----TEXT CRUD
//Upload Page
router.get('/upload/text_manual/:job_id', async (req, res) => {
    try {
        let job = await Job.findById(req.params.job_id);
        // console.log(job);
        res.render('client/upload_text_manual', {
            job
        });
    } catch (error) {
        console.log(error);
    }
});
//Push text objects into jobs
router.post('/upload/text_manual', async (req, res) => {
    console.log(req.body);

    try {
        req.body.textContents.forEach(async (t) => {
            //Create Text Object
            let textObj = {
                jobRef: req.body.job,
                textContent: t,
            }

            //Create Text Mongoose Object
            let text = Text(textObj);

            //Save
            let saveRes = await text.save();
            // console.log(saveRes);
            // Push Text into Job texts array
            let updateRes = await Job.findByIdAndUpdate(req.body.job, {
                $push: {
                    texts: saveRes._id,
                }
            })

            res.redirect(`/client/view/${req.body.job}`);

        })
    } catch (error) {
        console.log(error);
    }
});

//Upload CSV
router.get('/upload/text_csv/:job_id', async (req, res) => {
    try {
        let job = await Job.findById(req.params.job_id);
        res.render('client/upload_text_csv', {
            job
        });
    } catch (error) {
        console.log(error);
    }
});

router.post('/upload/text_csv', upload.single('file'), (req, res) => {
    const fileRows = [];
    console.log(req.body.job);
    console.log(req.file);
    csv.parseFile(req.file.path)
        .on("data", async (data) => {

            // Create text object
            let textObj = {
                jobRef: req.body.job,
                textContent: data[0],
            }

            //Create Text Mongoose Object
            let text = Text(textObj);

            try {
                //Save
                let saveRes = await text.save();
                // console.log(saveRes);
                // Push Text into Job texts array
                let updateRes = await Job.findByIdAndUpdate(req.body.job, {
                    $push: {
                        texts: saveRes._id,
                    }
                })
            } catch (error) {
                console.log(error);
            }
        })
        .on("end", function () {
            fs.unlinkSync(req.file.path); // remove temp file
            res.redirect(`/client/view/${req.body.job}`);
        })
});

//------DOWNLOAD JOB RESULTS
// const ws = fs.createWriteStream
router.get('/download/:job_id', async (req, res) => {

    try {
        //Find all job text that match job id
        //Build array that looks like below
        let texts = await Text.aggregate([{
            $match: {
                jobRef: new mongoose.Types.ObjectId(req.params.job_id)
            },
        }, {
            $project: {
                // textContent: 1,
                // sentLabel: 1,
                _id: 0,
                "text": "$textContent",
                "labels": "$sentLabel",
            }
        }]);

        //Download CSV
        //set file name, replace space with underscore
        let data = texts;
        let job = await Job.findById(req.params.job_id, "jobName");
        let fileName = job.jobName.trim().replace(/ /g, "_");
        let filePath = `public/reports/${fileName}.csv`;

        //Write to stream
        const ws = fs.createWriteStream(filePath);
        csv.write(data, {
                headers: true
            })
            .pipe(ws) //write to path
            .on("finish", function () { //when finish writing, download to client
                res.download(filePath, async (err) => {
                // res.download('public/img/labellrlogo.png', async (err) => {
                    try {
                        // fs.unlinkSync(filePath); //delete file after fownload ends
                    } catch (error) {
                        console.log(error);
                    }
                });
            });
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;