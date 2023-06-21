const mqtt = require('mqtt');

const host = '192.168.43.192';
const port = '1883';

const connect = () => {
    const client = mqtt.connect(`mqtt://${host}:${port}`,{
        username: 'pi',
        password: 'raspberry'
    })
    client.subscribe('sensorDHT22');
    client.on('connect', function () {
        console.log('MQTT client connected');
    });
}

const getdata = () => {
    let sensorData = {};
    client.on('message',(topic,message) => {
        if (topic === 'sensorDHT22') {
            console.log(message.toString());
            sensorData = JSON.parse(message.toString());
    }})
}


module.exports = {connect,getdata}