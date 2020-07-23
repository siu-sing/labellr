const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var textSchema = new mongoose.Schema({
    jobRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
    },
    textContent: {
        type: String,
        required: true,
    },
    langLabel:[String],
    sentLabel:[Number],
    topicLabel:[String],
});

const Text = mongoose.model("Text", textSchema);
module.exports = Text;