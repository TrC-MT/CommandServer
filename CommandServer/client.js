const net = require('net');

const client = net.createConnection({port: 3000}, () => {
    console.log('Connected to the server.');
    
})

client.setEncoding('utf-8');
//When the client recieves data
client.on('data', (data) => {
    console.log(data);
})
//When the client sends data
process.stdin.on('data', (data) => {
    client.write(data)
})