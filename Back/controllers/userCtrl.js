const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const userDataValidation = require('../validations/userValidation');


exports.createUser = (req, res, next) => {
    console.log('Demande de création de compte');
    // Validation des entrées de l'utilisateur
    const { error } = userDataValidation(req.body);
    if (error) {
        console.log(error.details[0].message);
        res.status(400).json({
            message: "Minimum 8 and maximum 30 characters, at least one uppercase letter, one lowercase letter, one number and one special character."
        });
        return;
    }
    // Cryptage du mot de passe, création d'un User, enregistrement sur la BD
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé.' }))
                .catch(error => res.status(400).json({ message: 'Le compte existe déja.' }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.logUser = (req, res, next) => {
    // Validation des entrées de l'utilisateur
    const { error } = userDataValidation(req.body);
    if (error) {
        console.log(error.details[0].message)
        res.status(400).json({ message: 'Saisie invalide.' });
        return
    };
    // Recherche un User sur la BD
    User.findOne({ email: req.body.email })
        .then(user => {
            // Trouvé ???
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé.' });
            }
            // Vérification du mot de passe, fourniture au front d'un TOKEN crypté +++
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Mauvais mot de passe.' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN_KEY,
                            { expiresIn: '1h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
