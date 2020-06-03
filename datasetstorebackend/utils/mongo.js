const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/image-details', {useNewUrlParser: true});
mongoose.connection.on('error', (e) => {
    console.log(e);
});
mongoose.connection.on('open', (e) => {
    console.log("db connected!")
});

const ImageDetailsSchema = new mongoose.Schema({
    newFileName: {type: String, require: true},
    originalFileName: {type: String, require: true},
    relativePath: {type: String, require: true},
    format: {type: String, require: true},
    size: {type: Number, require: true},
    shape: {type: String, require: true},
    lastModifiedDate: {type: Date, require: true},
    jobId: {type: String, require: true}
},{
    timestamps: true
});

const ImageDetails = mongoose.model('ImageDetails', ImageDetailsSchema);

module.exports = {ImageDetails};
