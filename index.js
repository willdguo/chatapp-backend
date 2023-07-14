const config = require('./utils/config')
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const roomsRouter = require('./controllers/rooms')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
const server = http.createServer(app)


mongoose.set('strictQuery', false)

console.log("connecting to mongoDB")

mongoose.connect(config.MONGODB_URI)
    .then(result => {
        console.log('connected to mongoDB')
    })
    .catch((error) => {
        console.log('error connecting to mongoDB')
    })

const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000",
    }
})


app.use(cors())
app.use(express.json())

app.use('/api/rooms', roomsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)


io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`)

    socket.on("send_message", (data) => {
        console.log(data)
        socket.to(data.room).emit("receive_message", data)
    })

    socket.on("join_room", (data) => {
        socket.join(data.roomId)
    })

    socket.on("leave_room", (data) => {
        socket.leave(data.roomId)
    })

    socket.on("disconnect", () => {
        console.log('user disconnected')
    })
})

server.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}. Happy chatting!`)
})