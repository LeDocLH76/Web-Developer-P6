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
    sauceObject = JSON.parse(req.body.sauce);

    const { value } = sauceDataValidation(sauceObject);
    sauceObject = {...value};

    const { error } = sauceDataValidation(sauceObject);
    if (error) return res.status(422).json({ message: error.details[0].message });

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
    if (req.file) {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const sauceObject = {
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                };

                const { value } = sauceDataValidation(sauceObject);
                sauceObject = { ...value };

                const { error } = sauceDataValidation(sauceObject);
                if (error) return res.status(401).json(error.details[0].message);

                if (sauceObject.userId != sauce.userId) {
                    return res.status(403).json({ message: 'Modification non autorisée.' })
                } else {
                    const filename = sauce.imageUrl.split('/images/')[1];
                    fs.unlink(`./images/${filename}`, () => {
                        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                            .then(() => res.status(201).json({ message: 'Sauce modifiée.' }))
                            .catch(error => res.status(404).json({ error }));
                    });
                }
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {

                sauceObject = {...req.body};

                const { value } = sauceDataValidation(sauceObject);
                sauceObject = { ...value };

                const { error } = sauceDataValidation(sauceObject);
                if (error) return res.status(401).json(error.details[0].message);

                if (req.body.userId != sauce.userId) {
                    return res.status(403).json({ message: 'Modification non autorisée.' })
                } else {
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(201).json({ message: 'Sauce modifiée.' }))
                        .catch(error => res.status(404).json({ error }))
                };
            })
            .catch(error => res.status(500).json({ error }));
    }
};

exports.likeSauce = (req, res, next) => {
    const { error } = likeDataValidation(req.body);
    if (error) return res.status(401).json(error.details[0].message);
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
                    } else {
                        if (sauce.usersDisliked.includes(req.body.userId)) {
                            console.log('Je retire le dislike');
                            if (sauce.dislikes >= 1) { sauce.dislikes-- };
                            const index = sauce.usersDisliked.findIndex(userId => userId == req.body.userId)
                            sauce.usersDisliked.splice(index, 1);
                            Sauce.updateOne({ _id: req.params.id }, { dislikes: sauce.dislikes, usersDisliked: sauce.usersDisliked, _id: req.params.id })
                                .then(() => res.status(201).json({ message: 'Sauce modifiée.' }))
                                .catch(error => res.status(404).json({ error }))
                        }
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