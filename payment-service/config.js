const CLOUDKARAFKA_BROKERS="sulky-01.srvs.cloudkafka.com:9094,sulky-02.srvs.cloudkafka.com:9094,sulky-03.srvs.cloudkafka.com:9094"
const CLOUDKARAFKA_USERNAME="b1uqjg0a"
const CLOUDKARAFKA_PASSWORD="4KD8uhIDOLHc2GaTBwekcoSWRtbHVUtv"
const CLOUDKARAFKA_TOPIC_PREFIX="b1uqjg0a-"

const config = {
    CLOUDKARAFKA_BROKERS,
    CLOUDKARAFKA_PASSWORD,
    CLOUDKARAFKA_TOPIC_PREFIX,
    CLOUDKARAFKA_USERNAME
}

module.exports = config;