require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const fs = require('fs');
const io = require('socket.io')(http);
const bodyParser = require('body-parser'); 
const fetch = require('node-fetch');
const functions = require('./util/functions');
const ejs = require('ejs');

const socketListener=require('./server/socket/socket_manager.js')
io.on('connection', socketListener);

functions.connectDB();

const editorRoutes=require("./server/routes/editorApi");
const usergRoutes=require("./server/routes/userApi");
const admingRoutes=require("./server/routes/admin");

// Setup View Engine
app.set('views', './public/views');
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');

app.use(express.static('./public'));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.text());
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
app.use(bodyParser.text({limit: '200mb'}));

//Setup Router
app.use("/editor",editorRoutes);
app.use("/user",usergRoutes);
app.use("/admin",admingRoutes);

// Setup Error
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 400;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('404')
});


// Setup Port
const port = 3000;
http.listen(port, () => {
    console.log(`Server on port ${port} is ready!`);
})

