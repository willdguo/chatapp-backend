const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const roomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    messages: [
        {
            type: Object,
        }
    ]
})

roomSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

roomSchema.plugin(uniqueValidator)

const Room = mongoose.model('Room', roomSchema)

module.exports = Room