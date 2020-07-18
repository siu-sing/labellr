const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    // 0 is admin, 1 is labeller, 2 is client
    userType: {
        type: Number,
        min: 0,
        max: 2,
    },

    //Labeller specific
    dateOfBirth: {
        type: String,
    },
    gender: {
        type: String,
    },
    country: {
        type: String,
    },
    languagePref: {
        type: String,
    },
    //List of jobs with status
    labelJobs: [{
            job: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Job"
            },
            jobStatus: {
                type: String,
                enum:["inProgress","complete"],
            },
        }
    ],

    //Client specific - industry

});

userSchema.pre("save", function (next) {
    var user = this;
    // Only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();

    //hash the password
    var hash = bcrypt.hashSync(user.password, 10);

    // Override the cleartext password with the hashed one
    user.password = hash;
    next();
});

userSchema.methods.validPassword = function (password) {
    // Compare is a bcrypt method that will return a boolean,
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
