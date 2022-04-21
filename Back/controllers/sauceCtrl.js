const Sauce = require('../models/sauce');
const fs = require('fs');
const sauceDataValidation = require('../validations/sauceValidation');
const likeDataValidation = require('../validations/likeValidation');


exports.allSauces = (req, res, next) => {
    console.log('Je suis dans all sauces.')
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));

};

exports.newSauce = (req, res, next) => {
    console.log('Je suis dans new sauce');
    // Si le filtre multer a rejeté le fichier, req.file n'existe pas
    if (!req.file) {
        return res.status(401).json({ message: 'Les fichiers acceptés: .jpg, .jpeg, .png' });
    }

    sauceObject = JSON.parse(req.body.sauce);

    const { value, error } = sauceDataValidation(sauceObject);
    sauceObject = value;
    if (error) {
        console.log(error.details[0].message, req.file.filename);
        fs.unlink(`./images/${req.file.filename}`, () => {
            console.log('Fichier effacé')
        });
        res.status(401).json({ message: 'Saisie invalide.' });
        return

    }

    sauceObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    sauceObject.likes = 0;
    sauceObject.dislikes = 0;
    sauceObject.userLiked = [];
    sauceObject.userDisliked = [];
    const sauce = new Sauce({ ...sauceObject });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée' }))
        .catch();
};

exports.oneSauce = (req, res, next) => {
    console.log('Je suis dans une sauce');
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            res.status(200).json(sauce)
        })
        .catch(error => res.status(404).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    console.log('Je suis dans delete sauce.');
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`./images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée.' }))
                    .catch(error => res.status(404).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.updateSauce = (req, res, next) => {
    console.log('Je suis dans update');
    // Si le filtre multer a rejeté le fichier, req.file n'existe pas,
    // mais la sauce est dans req.body.sauce au format json.
    // Il faut la replacer dans req.body en objet.
    if (req.body.sauce && !req.file) {
        req.body = JSON.parse(req.body.sauce);
    }

    if (req.file) {// Si l'image a changé
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const sauceObject = {
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                };

                const { value, error } = sauceDataValidation(sauceObject);
                sauceObject.name = value.name;
                sauceObject.manufacturer = value.manufacturer;
                sauceObject.description = value.description;
                sauceObject.mainPepper = value.mainPepper;
                sauceObject.heat = value.heat;
                sauceObject.userId = value.userId;
                sauceObject.imageUrl = value.imageUrl;
                if (error) {
                    console.log(error.details[0].message);
                    fs.unlink(`./images/${req.file.filename}`, () => {
                        console.log('Fichier effacé')
                    });
                    res.status(401).json({ message: 'Saisie invalide.' });
                    return
                }
                // Si l'utilisateur n'est pas proprietaire de la sauce
                // Si une image à été enregistrée, on l'efface et on retourne une erreur
                if (sauceObject.userId != sauce.userId) {
                    if (sauceObject.imageUrl) {
                        const filename = sauceObjet.imageUrl.split('/images/')[1];
                        fs.unlink(`./images/${filename}`, () => {
                            console.log('Fichier effacé')
                        });
                    }
                    return res.status(403).json({ message: 'Modification non autorisée.' })
                }
                // Si tout c'est bien passé, on efface l'image precedente et on enregistre la sauce dans la BD
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`./images/${filename}`, () => {
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(201).json({ message: 'Sauce modifiée.' }))
                        .catch(error => res.status(404).json({ error }));
                });
            })
            .catch(error => res.status(500).json({ error }));
    } else {// Si l'image n'a pas changé
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                sauceObject = { ...req.body };

                const { value, error } = sauceDataValidation(sauceObject);
                sauceObject = { ...value };
                if (error) {
                    console.log(error.details[0].message);
                    res.status(401).json({ message: 'Saisie invalide 2.' });
                    return
                }
                // Si l'utilisateur n'est pas proprietaire de la sauce et on retourne une erreur
                if (req.body.userId != sauce.userId) {
                    return res.status(403).json({ message: 'Modification non autorisée.' })
                }
                // Si tout c'est bien passé, on enregistre la sauce dans la BD
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(201).json({ message: 'Sauce modifiée.' }))
                    .catch(error => res.status(404).json({ error }))
            })
            .catch(error => res.status(500).json({ error }));
    }
};

exports.likeSauce = (req, res, next) => {
    const { error } = likeDataValidation(req.body);
    if (error) {
        console.log(error.details[0].message);
        res.status(401).json({ message: 'Valeur invalide.' });
        return
    }

    const userLike = req.body.like;
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            switch (userLike) {
                case 1:
                    console.log("J'aime !");
                    if (!sauce.usersLiked.includes(req.body.userId)) {
                        console.log('J\'ajoute le like !');
                        sauce.likes++;
                        sauce.usersLiked.push(req.body.userId);
                        Sauce.updateOne({ _id: req.params.id }, { likes: sauce.likes, usersLiked: sauce.usersLiked, _id: req.params.id })
                            .then(() => res.status(201).json({ message: 'Sauce modifiée.' }))
                            .catch(error => res.status(404).json({ error }))
                    }
                    break;

                case 0:
                    console.log("Je n'ai pas d'avis.");
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        console.log('Je retire le like');
                        if (sauce.likes >= 1) { sauce.likes-- };
                        const index = sauce.usersLiked.findIndex(userId => userId == req.body.userId)
                        sauce.usersLiked.splice(index, 1);
                        Sauce.updateOne({ _id: req.params.id }, { likes: sauce.likes, usersLiked: sauce.usersLiked, _id: req.params.id })
                            .then(() => res.status(201).json({ message: 'Sauce modifiée.' }))
                            .catch(error => res.status(404).json({ error }))
                    }
                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        console.log('Je retire le dislike');
                        if (sauce.dislikes >= 1) { sauce.dislikes-- };
                        const index = sauce.usersDisliked.findIndex(userId => userId == req.body.userId)
                        sauce.usersDisliked.splice(index, 1);
                        Sauce.updateOne({ _id: req.params.id }, { dislikes: sauce.dislikes, usersDisliked: sauce.usersDisliked, _id: req.params.id })
                            .then(() => res.status(201).json({ message: 'Sauce modifiée.' }))
                            .catch(error => res.status(404).json({ error }))
                    }
                    break;

                case -1:
                    console.log("Je n'aime pas !");
                    if (!sauce.usersLiked.includes(req.body.userId)) {
                        console.log('J\'ajoute le dislike !');
                        sauce.dislikes++;
                        sauce.usersDisliked.push(req.body.userId);
                        Sauce.updateOne({ _id: req.params.id }, { dislikes: sauce.dislikes, usersDisliked: sauce.usersDisliked, _id: req.params.id })
                            .then(() => res.status(201).json({ message: 'Sauce modifiée.' }))
                            .catch(error => res.status(404).json({ error }))
                    }
                    break;

                default:
                    console.log("Il y à une erreur !");
                    return res.status(400).json({ message: 'Il y à une erreur !' })
            }
        })
        .catch(error => res.status(500).json({ error }));
};