var express = require('express');
var app = express()

var mongoose = require('mongoose');
var Content = require('./models/content');
var url = 'mongodb+srv://admin:admintitan@cluster0.1gahz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(url, ()=> {
    console.log("Connected to MongoDB");
})

app.use(express.json());

app.get('/content', function(_, res) {
    Content.find((err, contents) => {
        if(err) {
            console.error(err);
            res.status(500).send(err);
        }

        console.log(contents);
        res.send(contents);
    })
})

app.get('/content/:id', function (req, res) {
    Content.findOne({id: req.params.id}, (err, content) => {
        if(err) {
            console.error(err);
            res.status(500).send(err);
        }
    
        console.log(content);
        res.status(200).send(content);
    })
})

app.post('/content', function (req, res) {
    const body = req.body;

    new Content(body).save().then((newContent) => {
        console.log(newContent);
        res.status(200).send(newContent);
    })
})



const port = process.env.PORT || 8080;

var server = app.listen(port, () => {
    console.log('Content API listening on port', port)
} );

server.setTimeout(500000);