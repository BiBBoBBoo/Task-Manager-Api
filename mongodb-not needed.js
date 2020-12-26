/*
Without destructuring:-

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID 
*/


// With destructuring we can frame the above lines of code  commented in just this single line
const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'Task-Manager'


MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client)=>{
    if(error){
        return console.log('This was some error in connection!!')
    }

    const db = client.db(databaseName)

    // Delete many objects at once
    /*
    db.collection('user').deleteMany({name: 'Vikram Seth'}).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
    */

    db.collection('tasks').deleteOne({_id: new ObjectID("5fd5db2a7cb52b80fc9beb8b")}).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })

})














/*--------------------------------------------------------Notes-------------------------------------------------------------*/

// 1. About objectID
/*
const id = new ObjectID()
console.log(id.id)
console.log(id.id.length)
console.log(id.getTimestamp())
console.log(id.toHexString())
console.log(id.toHexString().length)
*/


 // 2. Insertingone - INserting one document at a time
 /*   db.collection('user').insertOne({
        name: 'Vikram Seth',
        age: 26
    }, (error, result)=>{
        if(error){
            return console.log('Insert Properly Please')
        }

        console.log(result.ops) // op method stores all the documents we have inserted in our mongodb server
    })
*/


    // 3. Insertmany - Inserting many document at once
    /*
    db.collection('user').insertMany([
        {
            name: 'Rishav Kundu',
            age: 20
        },

        {
            name: 'Swati Kundu',
            age: 43
        }
    ], (error, result)=>{
        if(error){
            return console.log('Unable to push your file into the server!!')
        }

        console.log(result.ops)
    })*/


    // 4. Inserting multiple task objects in out server
    /*db.collection('tasks').insertMany([
        {
            description: 'Grocery Shopping',
            completed: true
        },

        {
            description: 'Go to barber',
            completed: false
        },

        {
            description: 'Do homework',
            completed: true
        },
    ], (error, result)=>{
        if(error){
            return console.log('Enter data correctly')
        }

        console.log(result.ops)
    })*/


        // 5. Return only one object - findone Method
    /*
        db.collection('user').findOne({_id: new ObjectID("5fd5e97df9312489b8d69ebb")}, (error, user)=>{
            if(error){
                return console.log('Such name doesnt exist')
            }
    
            console.log(user)
        })
    */



        // 6. Gives us all the relevent object that matches our find() criteria in an array form
        /*db.collection('user').find({age: 20}).toArray((error, users)=>{
            console.log(users)
        })*/



        // Gives us the count of the number of elements we get back from our count function
     /*
    db.collection('user').find({age: 20}).count((error, count)=>{
        console.log(count)
    })
    */


    // 7. Updating one object at a time
    /*
    const updatePromise = db.collection('user').updateOne({_id: new ObjectID("5fd5d7a84515bb2674cf95fd")}, {
        $inc:{
            age: 5
        }
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
    */


    // 8. Update many - to update more than one object at a time
    /*
    db.collection('tasks').updateMany({completed: true}, {
        $set:{
            completed:false
        }
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
    */