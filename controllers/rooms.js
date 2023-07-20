const roomsRouter = require('express').Router()
const Room = require('../models/room')

roomsRouter.get('/', async (request, response) => {
    const rooms = await Room.find({})
    response.status(201).json(rooms)
})

roomsRouter.get('/:id', async (request, response) => {
    const room = await Room.findOne({title: request.params.id})
    response.status(201).json(room)
})


roomsRouter.post('/', async (request, response) => {
    const body = request.body

    const newRoom = new Room({
        title: body.title,
        messages: []
    })

    console.log(newRoom)

    await newRoom.save()
    response.status(201).json(newRoom)
})

roomsRouter.put('/:id', async (request, response) => {
    const title = request.params.id

    // console.log(title)
    const body = request.body

    const room = await Room.findOne({title: title})
    
    const newRoom = {
        title: title,
        messages: room.messages.concat(body)
    }

    await Room.findByIdAndUpdate(room.id, newRoom, {new: true})

    response.status(201).json(newRoom)
})

module.exports = roomsRouter