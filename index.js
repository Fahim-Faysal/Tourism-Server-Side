const express = require('express')
const app = express()
const { MongoClient } = require('mongodb')
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 4000;


app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yeroo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
      try {
            await client.connect()

            const database = client.db("travelling")
            const travelCollection = database.collection("packages")

            const booked = client.db('booked')
            const bookedUserCollection = booked.collection('user')


            app.get('/package', async (req, res) => {

                  const cursor = await travelCollection.find({})
                  const result = await cursor.toArray()

                  res.send(result)
            })

            app.get('/details/:id', async (req, res) => {
                  const id = req.params.id

                  const query = { _id: ObjectId(id) }
                  const result = await travelCollection.findOne(query)
                  res.send(result)
            })

            app.post('/booked', async (req, res) => {
                  const doc = req.body
                  console.log(doc);
                  const result = await bookedUserCollection.insertOne(doc)
                  console.log(result);
                  res.json(result)

            })

            app.get('/allbooking', async (req, res) => {
                  const cursor = bookedUserCollection.find({})
                  const result = await cursor.toArray()
                  res.send(result)
            })
            app.delete('/allbooking/:id', async (req, res) => {
                  const id = req.params.id
                  const query = { _id: ObjectId(id) }

                  const result = await bookedUserCollection.deleteOne(query)
                  console.log(result);
                  res.json(result)
            })

      }
      finally {
            // await client.close()
      }
}
run().catch(console.dir)


app.get('/', async (req, res) => {
      res.send('assignment')
})

app.listen(port, () => {
      console.log('Port is running on :', port);
})