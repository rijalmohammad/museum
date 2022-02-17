var express = require('express');
var app = express()
var Config = require('./config');
var Kafka = require("node-rdkafka");

var mongoose = require('mongoose');
var Payment = require('./models/payment');
var PaymentMethod = require('./models/paymentMethod');
var url = 'mongodb+srv://admin:admintitan@cluster0.1gahz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

app.use(express.json());

const kafkaConf = {
    "group.id": "cloudkarafka-example",
    "metadata.broker.list": Config.CLOUDKARAFKA_BROKERS.split(","),
    "socket.keepalive.enable": true,
    "security.protocol": "SASL_SSL",
    "sasl.mechanisms": "SCRAM-SHA-256",
    "sasl.username": Config.CLOUDKARAFKA_USERNAME,
    "sasl.password": Config.CLOUDKARAFKA_PASSWORD,
    "debug": "generic,broker,security"
};

const prefix = Config.CLOUDKARAFKA_TOPIC_PREFIX;
const topic = `${prefix}payment`;
const producer = new Kafka.Producer(kafkaConf);
  
mongoose.connect(url, ()=> {
    console.log("Connected to MongoDB");
})

producer.on('event.log', function(log) {
    console.log(log);
});

app.post('/payment', function (req, res) {
    const body = req.body;
    new Payment({
        bookingId: body.bookingId,
        amount: body.amount,
        status: "PAID",
    }).save().then((newPayment) => {
        const dataProduced = {
            bookingId: body.bookingId,
            status: "PAID",
        }
        const message = new Buffer(JSON.stringify(dataProduced));
        producer.produce(topic, -1, message);

        res.status(200).send(newPayment);
    })
})

app.get('/payment/method', function(req, res) {
    PaymentMethod.find((err, methods) => {
        if(err) {
            console.error(err);
            res.status(500).send(err);
        }

        res.status(200).send(methods);
    })
})

app.post('/payment/method', function(req, res) {
    const body = req.body;

    new PaymentMethod({
        name: body.name
    }).save().then((newMethod) => {
        res.status(200).send(newMethod);
    })
})

producer.connect();

const port = process.env.PORT || 8080;

var server = app.listen(port, () => {
    console.log('Payment API listening on port', port)
} );

server.setTimeout(500000);