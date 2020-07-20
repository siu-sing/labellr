const router = require("express").Router();
const Job = require('../models/job.model');
const Text = require('../models/text.model');
const multer = require('multer');
const upload = multer({
    dest: 'tmp/csv/'
});
const csv = require('fast-csv');
const fs = require('fs');

//------ JOB CRUD
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
        let findRes = await Job.findById(req.params.id).populate("owner texts");
        // console.log(findRes);
        res.render("client/view", {
            job: findRes
        })
    } catch (error) {
        console.log(error);
    }
});

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


module.exports = router;