const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoute');
const sauceRoutes = require('./routes/sauceRoute');
const path = require('path');
require('dotenv').config();

mongoose.connect(process.env.MONGOOSE_KEY,{useNewUrlParser: true,useUnifiedTopology: true})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api', sauceRoutes);

module.exports = app;