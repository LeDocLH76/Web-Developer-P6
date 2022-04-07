const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

app.post('/api/auth/signup', (req, res, next) => {
    console.log(req.body);
    res.status(200).json({message: 'UnString'});
});

app.post('/api/auth/login', (req, res, next) => {
    res.status(200).json({userId: 'IdentifiantUtilisateur', token: 'MonToken' });
})

app.get('/api/truc', (req, res, next) => {
    const truc = [
        { cle1: 'Valeur1' },
        { cle1: 'Valeur2' },
        { cle1: 'Valeur3' },
        { cle1: 'Valeur4' }
    ];
    res.status(200).json(truc);
})




module.exports = app;