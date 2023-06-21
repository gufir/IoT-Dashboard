const mqtt = require('mqtt');
const express = require('express');
const coap = require('coap');
const WebSocket = require('ws');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '')));

const host = '192.168.43.192';
const mqtt_port = '1883';
const coap_port = '5683';

const mqttclient = mqtt.connect(`mqtt://${host}:${mqtt_port}`,{
    username: 'pi',
    password: 'raspberry'
});

mqttclient.on('connect', () => {
    mqttclient.subscribe('sensorDHT22',{qos: 0});
    console.log('MQTT client connected');
});

const wss = new WebSocket.Server({ port: 3001 });
const wss2 = new WebSocket.Server({ port: 3002 });


// Handle incoming messages from MQTT
let sensorData = {};
mqttclient.on('message', function (topic, message) {
  if (topic === 'sensorDHT22') {
    console.log(message.toString());
    sensorData = JSON.parse(message.toString());
    wss.clients.forEach(function each(client1) {
        if (client1.readyState === WebSocket.OPEN) {
            client1.send(JSON.stringify(coapData));
        }});
}
});

let coapData = {};
function datacoap(){
    const coapclient = coap.request('coap://192.168.43.192/Sensor')
    coapclient.on('response', (coapResponse) => {
        coapResponse.on('data', (data) => {
            // Emit CoAP response data to the dashboard via WebSocket
            coapData = JSON.parse(data.toString());
            console.log(coapData)
            wss2.clients.forEach(function each(client2) {
                if (client2.readyState === WebSocket.OPEN) {
                    client2.send(JSON.stringify(coapData));
                }});
            });
        })
    coapclient.end();

};

setInterval(datacoap,1000);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
 
app.listen(3000, () => {
    console.log('API server listening on port 3000');
});