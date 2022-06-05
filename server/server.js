const { addUser, removeUser, getUsersNumberByRoom } = require("./user");

const http = require("http");
const express = require("express");
require("dotenv/config");

const app = express()
const server = http.createServer(app)
const io = require("socket.io")(server, {
    cors: {
      origin: process.env.ORIGIN || "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
});


io.on("connection", (socket) => {
    console.log('A Connection has been made')

    socket.on("join", ({ name, room }, callBack) => {
        const { user, error } = addUser({ id: socket.id, name, room });
    
        if (error) return callBack(error);
    
        socket.join(user.room);
        callBack(null);

        socket.emit("message", {
            user: "admin",
            text: `${user.name}, welcome to ${user.room}`,
        });

        io.to(user.room).emit('roomData', {number: getUsersNumberByRoom(user.room)});

        socket.broadcast
            .to(user.room)
            .emit("message", { user: "Admin", text: `${user.name} has joined!` });

        socket.on("sendMessage", ({ message }) => {
            io.to(user.room).emit("message", {
                user: user.name,
                text: message,
            });
        });
    });

    socket.on('disconnect', ()=> {
        const user = removeUser(socket.id);

        io.to(user.room).emit("message", {
            user: "Admin",
            text: `${user.name} just left the room`,
        });

        io.to(user.room).emit('roomData', {number: getUsersNumberByRoom(user.room)});

        console.log("A disconnection has been made");
    })
})


server.listen(process.env.PORT || 5000, () => console.log(`Server is connected`))