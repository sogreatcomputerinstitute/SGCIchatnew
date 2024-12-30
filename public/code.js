// Chat Application with Text and Image Support

(function() {
    const app = document.querySelector(".app");
    const socket = io();
    
    let uname;

    // Show the login modal
    document.getElementById('login-user').addEventListener('click', function() {
        document.getElementById('login-modal').style.display = 'block';
    });
    // Show the signup modal
    document.getElementById('signup-user').addEventListener('click', function() {
        document.getElementById('signup-modal').style.display = 'block';
    });
    // Close login modal
    document.getElementById('close-login-modal').addEventListener('click', function() {
        document.getElementById('login-modal').style.display = 'none';
    });
    // Close signup modal
    document.getElementById('close-signup-modal').addEventListener('click', function() {
        document.getElementById('signup-modal').style.display = 'none';
    });
    // Handle login submission
    document.getElementById('login-submit').addEventListener('click', function() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.message === 'Login successful') {
                uname = username;
                document.getElementById('login-modal').style.display = 'none';
                app.querySelector(".join-screen").classList.remove("active");
                app.querySelector(".chat-screen").classList.add("active");
                socket.emit("newuser", uname); // Notify server of new user
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Handle signup submission
    document.getElementById('signup-submit').addEventListener('click', function() {
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;

        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.message === 'User  registered successfully, Please Login to Continue...') {
                document.getElementById('signup-modal').style.display = 'none';
            }
        })
        .catch(error => console.error('Error:', error));
    });
    // Handle sending messages
    app.querySelector(".chat-screen #send-message").addEventListener("click", function() {
        let message = app.querySelector(".chat-screen #message-input").value;
        if (message.length > 0) {
            renderMessage("my", {
                username: uname,
                text: message
            });
            socket.emit("chat", {
                username: uname,
                text: message
            });
            app.querySelector(".chat-screen #message-input").value = "";
        }
    });

    // Handle exiting the chat
    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function() {
        socket.emit("exituser", uname);
        window.location.href = window.location.href; // Reload the page
    });

    socket.on("update", function(update) {
        renderMessage("update", update);
    });
    
    socket.on("chat", function(message) {
        renderMessage("other", message);
    });
    
    socket.on("image", function(img) {
        renderMessage("other", { username: img.username, image: img.data });
    });
    
    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        let el = document.createElement("div");
    
        if (type == "my") {
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
            <div>
                <div class="name">You</div>
                <div class="image">${message.image ? `<img src="${message.image}" style="max-width: 100%; height: auto; " />` : ''}</div>
                <div class="text">${message.text ? message.text : ''}</div>
            </div>
            `;
        } else if (type == "other") {
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
            <div>
                <div class="name">${message.username}</div>
                <div class="image">${message.image ? `<img src="${message.image}" alt="Image" style="max-width: 100%; height: auto;" />` : ''}</div>
                <div class="text">${message.text ? message.text : ''}</div>
            </div>
            `;
        } else if (type == "update") {
            el.setAttribute("class", "update");
            el.innerText = message;
        }
    
        // Append the message to the container
        messageContainer.appendChild(el);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
    
    // Handle sending images
    document.getElementById('imageInput').onchange = function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = function() {
            const imgData = reader.result;
            socket.emit('image', { username: uname, data: imgData });
            renderMessage("my", { username: uname, image: imgData });
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };
})();
