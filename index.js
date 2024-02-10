const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const mediaCollection = client.db('connectify').collection('media');

    // media
    app.post('/media', async (req, res) => {
      const post = req.body;
      console.log(post)
      const response = await mediaCollection.insertOne(post);
      res.send({ Message: response })
    })
    
    // Get All Post 
    app.get('/media', async(req,res)=>{
      const result = await mediaCollection.find().toArray();
      res.send(result);
    })
    app.get('/media/top', async (req, res) => {
      try {
        const pipeline = [
          {
            $project: {
              _id: 1,
              email: 1,
              caption: 1,
              image: 1,
              date: 1,
              reactions: { $sum: [{ $ifNull: ['$like', 0] }] } // Assuming 'like' field represents reactions
            }
          },
          {
            $sort: { reactions: -1 }
          },
          {
            $limit: 3
          }
        ];
    
        const topPosts = await mediaCollection.aggregate(pipeline).toArray();
        res.send(topPosts);
      } catch (error) {
        console.error('Error fetching top posts:', error);
        res.status(500).send({ error: 'An error occurred while fetching top posts.' });
      }
    });
    
    // users 

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

    // New endpoint for handling PUT request to update user profile
    app.put('/user/:id', async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      delete updatedUser._id;

      const result = await usersCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedUser },
        { returnOriginal: false }
      )
    });
    
    // Get User for Build Profile Info.
    app.get('/user', async (req, res) => {
      const email = req.query.email;
      const user = await usersCollection.findOne({ email });
      // console.log(user);
      res.send(user);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
  res.send('server going well')
})



app.listen(port, () => {
  console.log('Hey Dev! No pain no gain', port);
})