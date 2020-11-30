const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 
const fetch = require('node-fetch');
const adminRoutes=require("./routes/SingleCodeApi");



app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use("/admin",adminRoutes);
// app.use(`/api/${apiversion}/products`,productRoutes);
// app.use(`/api/${apiversion}/marketing`,marketingRoutes);
// app.use(`/api/${apiversion}/user`,usergRoutes);
// app.use(`/api/${apiversion}/order`,checkoutgRoutes);

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

app.listen(port, () => {
    console.log(`Server on port ${port} is ready!`);
})

