const express = require('express')
const { update } = require('../models/user')

const router = new express.Router()

const auth = require('../middleware/auth')

const Users = require('../models/user')

const multer = require('multer')

const sharp = require('sharp')

const { sendWelcomeEmail } = require('../emails/account')


// Create USers
router.post('/users', async (req, res)=>{
    const user = new Users(req.body)

    try {
        await user.save()
        
        sendWelcomeEmail(user.email, user.name)

        const token = await user.generateAuthToken()

        res.status(201).send({user, token})
    }catch(e){
        res.status(400).send(e)
    }

})


// Login
router.post('/users/login', async (req, res)=>{
    try{
        const user = await Users.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        res.status(400).send()
    }
})

// Logout from one device
router.post('/users/logout', auth , async(req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })

        await req.user.save()

        res.send()
    }catch(e){
        res.status(500).send()
    }
})

// Logout of all devices
router.post('/users/logoutAll', auth, async (req, res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})


// Fetching all the users
router.get('/users/me', auth, async (req, res)=>{
    res.send(req.user)
})


// Updating User
router.patch('/users/me', auth,  async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedupdates = ['name', 'age', 'email', 'password']
    const isValidOperation = updates.every((updates) => allowedupdates.includes(updates))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid Updates!'})
    }

    try{

        updates.forEach((update)=> req.user[update] = req.body[update])

        await req.user.save()

        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})


// Deleting user
router.delete('/users/me', auth,  async (req, res)=>{

    try{
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})


// Upload profile Picture
const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an Image'))
        }
        cb(undefined, true)
    }
})


router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res)=>{
    
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar =  buffer
    await req.user.save()
    res.send()
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

// Delete profile Picture
 router.delete('/users/me/avatar', auth, async(req, res)=>{
     req.user.avatar = undefined
     await req.user.save()
     res.send()
 })


//Load the profile picture
router.get('/users/:id/avatar', async(req, res)=>{
    try{
        const user = await Users.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

module.exports = router
