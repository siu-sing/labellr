const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

var jobSchema = new mongoose.Schema({
    jobName: {
        type: String,
        required: true,
    },
    dueDate: {
        type: String,
    },
    owner: {
        type: String,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "Client"
    },
    //Number of labels per data point requested by client
    numLabels: Number,
    texts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Text",
    }],
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Text",
    }],
    // configs: (the configurations for text and image labelling)
}, {
    timestamps: true,
});
const Job = mongoose.model("Job", jobSchema);
module.exports = Job;

