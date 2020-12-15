require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser'); 
const fetch = require('node-fetch');
const functions = require('./util/functions');

functions.connectDB();
// let notes='';
// let notes_taken = 0;

// // event-handler for new incoming connections
// io.on('connection', (socket)=>{

//     socket.emit('startup', { notes: notes, notes_taken: notes_taken });

//     socket.on('notes_content', (data)=>{
//         notes = data.notes;
//         io.emit('notes_content', data);
//     })

// });



const editorRoutes=require("./server/routes/editorApi");
const usergRoutes=require("./server/routes/userApi");
const admingRoutes=require("./server/routes/admin");

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use("/editor",editorRoutes);
app.use("/user",usergRoutes);
app.use("/admin",admingRoutes);

app.get('/', (req, res) => {
    res.redirect('../../index.html');
});



app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 400;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send('Error message')
});

const port = 3000;

http.listen(port, () => {
    console.log(`Server on port ${port} is ready!`);
})

