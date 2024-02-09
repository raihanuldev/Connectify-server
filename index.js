const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
const port = 3000;

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://connectify:E0mhvSnqMGnoORpY@cluster0.jvqibpv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    const usersCollection = client.db('connectify').collection('users');


    app.get('/users/:id',async(req,res)=>{
        res.send('data recibed')
    })
    app.post('/users', async (req, res) => {
        const user = req.body;
        const query = { email: user.email };
        const exitingUser = await usersCollection.findOne(query);
        if (exitingUser) {
          // console.log(exitingUser);
          return res.send({ Message: 'User Already exiting on Database' })
        }
        const result = await usersCollection.insertOne(user);
        // console.log(result);
        res.send(result)
      })



      
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',async(req,res)=>{
    res.send('server going well')
})



app.listen(port, () => {
    console.log('Hey Dev! No pain no gain',port);
  })