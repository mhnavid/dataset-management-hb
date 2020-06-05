const mongoose = require('mongoose');

const mongoHost     = process.env.MONGO_HOST     || '192.168.99.100';
const mongoPort     = process.env.MONGO_PORT     || '27017';
const mongoUsername = process.env.MONGO_USERNAME || '';
const mongoPassword = process.env.MONGO_PASSWORD || '';
const mongoDBName   = process.env.MONGO_DBNAME   || 'image-details';

if (mongoUsername != ''){
    mongoose.connect('mongodb://'+mongoUsername+':'+mongoPassword+'@'+mongoHost+':'+mongoPort+'/'+mongoDBName, {useNewUrlParser: true, useUnifiedTopology: true});
} else {
    mongoose.connect('mongodb://'+mongoHost+':'+mongoPort+'/'+mongoDBName, {useNewUrlParser: true, useUnifiedTopology: true});
}

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
