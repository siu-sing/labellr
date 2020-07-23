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
    dataType: String,   //text or image
    labelType: String,    //sentiment or topic
    status: {
        type: String,
        default: "notStarted",
        enum: ["notStarted", "inProgress","closed"]
    },
    texts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Text",
    }],
    textTopics: [String],
    imageTopics: [String],
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
    switch (this.status) {
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

jobSchema.virtual('statusColor').get(function() {
    let statusname="";
    switch (this.status) {
        case "notStarted":
            statusname = "warning"
            break;
        case "inProgress":
            statusname = "success"
            break;
        case "closed":
            statusname = "secondary"
            break;
    }
    return statusname;
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;

