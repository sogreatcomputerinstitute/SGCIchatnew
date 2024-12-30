const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const fs = require("fs");

app.use(express.static(path.join(__dirname, 'public')));
const usersFile = 'users.json';
io.on("connection", function(socket){
    socket.on("newuser", function(username){
        socket.broadcast.emit("update", username + " Joined the conversation 😊 😊");
    });
    socket.on("exituser", function(username){
        socket.broadcast.emit("update", username + " Left the conversation");
    });
    socket.on("chat", function(message){
        socket.broadcast.emit("chat", message);
    });
    socket.on('image', (img) => {
        socket.broadcast.emit('image', img); // Send to all clients except the sender
    });
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Load existing users from JSON file
let users = {};
if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile));
}

// Endpoint to register a new user
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (users[username]) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    users[username] = password;
    fs.writeFileSync(usersFile, JSON.stringify(users));
    res.status(200).json({ message: 'Signup successful' });
});

// Endpoint to login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!users[username]) {
        return res.status(400).json({ message: 'User  data not found, please signup' });
    }

    if (users[username] !== password) {
        return res.status(400).json({ message: 'Incorrect password' });
    }

    res.status(200).json({ message: 'Login successful' });
});

// Serve the HTML files
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

server.listen(5000);
