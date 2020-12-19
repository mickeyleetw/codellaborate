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

functions.connectDB();

const editorRoutes=require("./server/routes/editorApi");
const usergRoutes=require("./server/routes/userApi");
const admingRoutes=require("./server/routes/admin");

// Setup View Engine
app.set('views', './public/views');
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

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
    res.send('Error message')
});


// Setup Port
const port = 3000;
http.listen(port, () => {
    console.log(`Server on port ${port} is ready!`);
})

