const router = require("express").Router();
const Job = require('../models/job.model');
const User = require('../models/user.model');


let getSummaryUsers = async function(){
    try {
        let total = await User.count();
        let summ = await User.aggregate([
            {$group:{_id:"$userType", count:{$sum:1}}}
        ]);
        return {total, summ};
    } catch (error) {
        console.log(error);
    }
    
};

let getUserTypeName = function(userType){
    let name="";
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
        userSumm.summ.forEach(type=>{
            type._id= getUserTypeName(type._id);
        })

        //Get All Users
        let users = await User.find();
        console.log(users);

        res.render("admin/dashboard", {
            jobs: jobs,
            userSumm: userSumm,
            users: users
        })
    } catch (error) {

    }

});

module.exports = router;