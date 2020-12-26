const express = require('express')

const app = express()

const userRouter = require('./router/user')

const taskrouter = require('./router/task')

const port = process.env.PORT

const auth = require('./middleware/auth')

require('./db/mongoose')


app.use(express.json()) // Will automatically parse any json file comming as request

app.use(userRouter)

app.use(taskrouter)

app.listen(port, ()=>{
    console.log('The app is up and running on port ' + port)
})













/***********************************************************xxxxx*************************************************************/
/*
// GET maintainance middleware
app.use((req, res, next)=>{
    if(req.method === 'GET'){
        res.send('GET requests are disabled')
    }else{
        next()
    }
})


// MAintainannce Middleware
app.use((req, res, next)=>{
    res.status(503).send('Server Down!! Will beback up in a while!')
})
*/