const Sauce = require('../models/sauce');
const fs = require('fs');

exports.allSauces = (req, res, next) => {
    console.log('Je suis dans all sauces.')
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));

};

exports.newSauce = (req, res, next) => {
    console.log('Je suis dans new sauce');
    sauceObject = JSON.parse(req.body.sauce);

    sauceObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    sauceObject.likes = 0;
    sauceObject.dislikes = 0;
    sauceObject.userLiked = [];
    sauceObject.userDisliked = [];
    const sauce = new Sauce({ ...sauceObject });
    // console.log(req.body.sauce);
    // console.table(sauceObject);

    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée' }))
        .catch();

};

exports.oneSauce = (req, res, next) => {
    console.log('Je suis dans une sauce');
    // console.log('Id = ' + req.params.id);
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // console.log('La sauce enregistrée sur la bd = ', sauce);
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
                console.log(`reqId = ${sauceObject.userId}, sauceId = ${sauce.userId}`);

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
                if (req.body.userId != sauce.userId) {
                    return res.status(403).json({ message: 'Modification non autorisée.' })
                } else {
                    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
                        .then(() => res.status(201).json({ message: 'Sauce modifiée.' }))
                        .catch(error => res.status(404).json({ error }))
                };
            })
            .catch(error => res.status(500).json({ error }));
    }
};

exports.likeSauce = (req, res, next) => {
    // console.log(req.body);
    // console.log(req.params.id);
    Sauce.findOne({ _id: req.params.id })
    .then( sauce =>{
        const userLike = parseInt(req.body.like);
        const Likes = sauce.likes;
        const Dislikes = sauce.dislikes;
        const usersLiked = sauce.usersLiked;
        const usersDisliked = sauce.usersDisliked;
        
        switch (userLike) {
            case 1:
                console.log("J'aime !")
                return res.status(200).json({ message: 'J\'aime !' })
                break;
            case 0:
                console.log("Je n'ai pas d'avis.")
                return res.status(200).json({ message: 'Je n\'ai pas d\'avis.' })
                break;
            case -1:
                console.log("Je n'aime pas !")
                return res.status(200).json({ message: 'Je n\'aime pas !' })
                break;
            default:
                console.log("Il y à une erreur !");
                return res.status(400).json({ message: 'Il y à une erreur !' })
        }
    })
    .catch(error => res.status(500).json({ error }));
}