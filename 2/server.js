const express = require('express');
const app=express();
//middleware to serve static files
app.use('/static',express.static('public'));
app.use('/static',express.static('assets'));


app.get('/',(req,res)=>{
    res.send('Hello world');
});
app.get('/about',(req,res)=>{
    res.send('About page');
});
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});