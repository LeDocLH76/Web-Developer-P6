const Sauce = require('../models/sauce');


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
    console.log('Je suis dans delete sauce.')
    // Vérifier utilisateur
    // Supprimer l'image
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimée.' }))
        .catch(error => res.status(404).json({ error }));
};

exports.updateSauce = (req, res, next) => {
    console.log('Je suis dans update');
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(201).json({ message: 'Sauce modifiée.' }))
        .catch(error => res.status(404).json({ error }));
};

