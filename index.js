const cors = require('cors');
const express = require('express');
const app = express();
const port = 3000;

// middleware
app.use(cors())
app.use(express.json())



app.get('/',async(req,res)=>{
    res.send('server going well')
})



app.listen(port, () => {
    console.log('Hey Dev! No pain no gain',port);
  })