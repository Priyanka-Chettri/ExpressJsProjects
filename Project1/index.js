

const express=require('express');
const port =3003
const app=express();
const bodyParser=require("body-parser")

app.use(bodyParser.json())


app.get('/', (req, res)=>{
    res.send('Hey there!')
})

app.post('/itspost',(req,res)=>{
console.log(req.body);
 res.send("Data received")
})

app.listen(port)