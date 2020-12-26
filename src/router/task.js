const express = require('express')

const router = new express.Router()

const task = require('../models/task')

const auth = require('../middleware/auth')

const Users = require('../models/user')


// Create Tasks
router.post('/task', auth,  async (req, res)=>{
    const tasks = new task({
        ...req.body,
        owner: req.user._id
    })

    try{
        await tasks.save()
        res.status(201).send(tasks)
    }catch(e){
        res.status(400).send(e)
    }
})


// Fetching all the tasks
router.get('/task', auth,  async (req, res)=>{

    const match = {}

    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try{
        // const tasks = await task.find({owner: req.user._id})

        await req.user.populate({
            path: 'task',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.task)
    }catch(e){
        res.status(500).send()
    }
})


// Fetching single task
router.get('/task/:id', auth,  async(req, res)=>{
    const _id = req.params.id
    
    try{
        const taskOne = await task.findOne({_id, owner: req.user._id})
        if(!taskOne){
            res.status(404).send()
        }

        res.send(taskOne)
    }catch(e){
        res.status(500).send()
    }
})


// Updating task
router.patch('/task/:id', auth,  async(req, res)=>{
    const updates = Object.keys(req.body)
    const allowedupdates = ['description', 'completed']
    const isValidOperation = updates.every((updates) => allowedupdates.includes(updates))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid Update'})
    }

    const _id = req.params.id

    try{
        const taskup = await task.findOne({_id, owner:req.user._id})
        if(!taskup){
            return res.status(404).send({error: 'Invalid ID Provided'})
        }
        updates.forEach((update)=> taskup[update] = req.body[update])
        await taskup.save()
        res.send(taskup)
    }catch(e){
        res.status(400).send(e)
    }
})


// Deleting task
router.delete('/task/:id', auth,  async (req, res)=>{
    const _id = req.params.id

    try{
        const taskDel = await task.findOneAndDelete({_id, owner: req.user._id})
        if(!taskDel){
            return res.status(404).send()
        }

        res.send(taskDel)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router
