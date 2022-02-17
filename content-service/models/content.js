const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contentSchema = new Schema({
    id: String,
    name: String,
    artist: String,
    date: String,
    site: String,
    size: String,
    description: String,
    image: String,
    remark: String
})

const Content = mongoose.model('content', contentSchema);

module.exports = Content;