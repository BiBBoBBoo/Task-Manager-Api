const mongoose = require('mongoose')

const validator = require('validator')

const taskSchema = new mongoose.Schema({
    description:{
        type: String,
        required: true,
        trim: true,
    },
    completed:{
        type: Boolean,
        default: false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users' // have to use the same identifier name as we use while defining the owner model
    }
}, {
    timestamps:true
})

const task = mongoose.model('tasks', taskSchema)

module.exports = task