import express from 'express';
import mongoose from 'mongoose';
import * as ENV from './config/env';

const app = express();

// db connection
mongoose.connect(ENV.mongoDbUrl, { useNewUrlParser: true });

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// CORS
app.use(function (req, res, next) {
    // Websites allowed to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods to be allowed
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers to be allowed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Pass to next layer of middleware
    res.setHeader('Content-Type', 'application/json');
    // setting header content-type application/json
    next();
});

// API routes defined 
const apiRouter = require('./routes/v1/api');
app.use('/api/v1', apiRouter);
const adminRouter = require('./routes/v1/admin');
app.use('/admin/v1', adminRouter);

// app config
app.listen(ENV.port, () => {
    console.log(`Server running at http://${ENV.hostname}:${ENV.port}/`);
});

// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Server is listening on port: ${port}`));
