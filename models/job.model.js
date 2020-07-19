const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var jobSchema = new mongoose.Schema({
    jobName: {
        type: String,
        required: true,
    },
    dueDate: {
        type: String,
    },
    owner: {
        // type: String,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    //Number of labels per data point requested by client
    numLabels: Number,
    dataType: String,
    labelType: [String],
    status: {
        type: String,
        default: "notStarted",
        enum: ["notStarted", "inProgress","closed"]
    },
    texts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Text",
    }],
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Images",
    }],
    // configs: (the configurations for text and image labelling)
}, {
    timestamps: true,
});

jobSchema.virtual('statusName').get(function() {
    let statusname="";
    switch (this.userType) {
        case "notStarted":
            statusname = "Not Published"
            break;
        case "inProgress":
            statusname = "Published"
            break;
        case "closed":
            statusname = "Closed"
            break;
    }
    return statusname;
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;

