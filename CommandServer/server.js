const net = require('net');
const fs = require('fs')

const log = './server.log.txt'
fs.writeFile(log, `Begin server log.\n`, (err) => {
    if(err) throw err;
    console.log('Created server.log.txt')
})

let client_count = 0;
let Clients = [];
const admin_password = `123Can'tHackMe`

const server = net.createServer((client) => {
    client.setEncoding('utf-8');
    //handle new connection
    client_count += 1;
    client.identifier = `${client_count}`;
    client.name = `Anonymous`;
    Clients.push(client);
    fs.appendFile(log, `${client.identifier} has joined the chat.\n`, (err) => {
        if(err) throw err;
    })
    for(let i = 0; i < Clients.length; i++){
        if(Clients[i].identifier !== client.identifier){
            Clients[i].write(`${client.identifier} has joined the chat.\n`)
        }
        else{
            Clients[i].write(`Welcome to the chat ${client.identifier}!\n`);
        };
    };
    
    //When a client sends data
    client.on('data', (message) => {
        if(message.trim() === '/exit'){
            for(let i = 0; i < Clients.length; i++){
                if(Clients[i].identifier !== client.identifier){
                    Clients[i].write(`${client.identifier} left the chat.\n`)
                    Clients = Clients.filter(client => client.identifier)
                }
                else{
                    Clients[i].write('Goodbye.\n')
                    Clients[i].destroy();
                }
            }
            fs.appendFile(log, `${client.identifier} left the chat.\n`, (err) => {
                if(err) throw err;
            })
        }
        else if(message.trim() === '/clientlist'){
            for(let i = 0; i < Clients.length; i++){
            Clients[client.identifier -1].write(`${Clients[i].name} | `)
            }
        }
        else if(message.split(' ')[0] == '/w'){
            var bool_error = false;
            let whisper = '';
            if(message.split(' ')[1].trim() !== client.identifier){
                for(let i = 0; i < Clients.length; i++){
                    if(Clients[i].identifier == message.split(' ')[1].trim()){
                        for(let j = 2; j < message.split(' ').length; j++){
                            whisper += message.split(' ')[j] + ' ';
                        }
                        whisper.trim()
                        Clients[i].write(`${client.name} whispers: ${whisper}`);
                        break;
                    }
                    else if(i == (Clients.length -1)){
                        Clients[client.identifier -1].write('Error: Invalid client identifier.')
                        bool_error = true
                    }
                }
            }
            else{
                Clients[client.identifier -1].write('Error: Self whispering is not permitted.')
                        bool_error = true
            }
            
            fs.appendFile(log, `${client.identifier} whispered '${whisper.trim()}' to ${message.split(' ')[1]}. An error occurred: ${bool_error}\n`, (err) => {
                if(err) throw err;
            })
        }
        else if(message.split(' ')[0] == '/kick'){
            var bool_error = false;
            for(let i = 0; i < Clients.length; i++){
                if(Clients[i].identifier == message.split(' ')[1]){
                   if(message.split(' ')[2].trim() === admin_password){
                    for(let i = 0; i < Clients.length; i++){
                        if(Clients[i].identifier !== message.split(' ')[1]){
                            Clients[i].write(`${message.split(' ')[1]} has been kicked from the chat.\n`)
                            Clients = Clients.filter(client => message.split(' ')[1])
                        }
                        else{
                            Clients[i].write('You have been kicked from the chat.\n')
                            Clients[i].destroy();
                        }
                    }
                   }
                   else{
                    Clients[client.identifier -1].write('Error: Incorrect password.')
                    bool_error = true
                   }
                   break;
                }
                else if(i == (Clients.length -1)){
                    Clients[client.identifier -1].write('Error: Invalid client identifier.')
                    bool_error = true
                }
            }
            fs.appendFile(log, `${client.identifier} kicked ${message.split(' ')[1]}. An error occurred: ${bool_error}\n`, (err) => {
                if(err) throw err;
            })
        }
        else if(message.split(' ')[0] == '/username'){
            var bool_error = false;
            for(let i = 0; i < Clients.length; i++){
                if(message.split(' ')[1].trim() == Clients[i].name){
                    for(let i = 0; i < Clients.length; i++){
                        if(Clients[i].identifier == client.identifier){
                            Clients[i].write('Error: Username already in use.')
                            bool_error = true
                            break;
                        }
                    }
                }
                else if(i == (Clients.length -1)){
                    client.name = message.split(' ')[1].trim()
                    Clients[client.identifier -1].write(`Your username has been updated to ${client.name}`)
                    break;
                }
            }
            fs.appendFile(log, `${client.identifier} tried to switch their username to ${message.split(' ')[1].trim()}. An error occurred: ${bool_error}\n`, (err) => {
                if(err) throw err;
            })
            
        }
        else{
            fs.appendFile(log, `${client.identifier} says: ${message}\n`, (err) => {
                if(err) throw err;
            })
            for(let i = 0; i < Clients.length; i++){
                if(Clients[i].identifier !== client.identifier){
                    Clients[i].write(`${client.name} says: ${message}\n`)
                }
                else{
                    Clients[i].write('Your message has been sent.\n')
                }
            }
        }
    })
    client.on('close', () => {
        for(let i = 0; i < Clients.length; i++){
            if(Clients[i].identifier !== client.identifier){
                Clients[i].write(`${client.identifier} left the chat.\n`)
                Clients = Clients.filter(client => client.identifier)
            }
            else{
                Clients[i].write('Goodbye.\n')
                Clients[i].destroy();
            }
        }
        fs.appendFile(log, `${client.identifier} left the chat.\n`, (err) => {
            if(err) throw err;
        })
    })

}).listen(3000);

console.log('Listening on port 3000')