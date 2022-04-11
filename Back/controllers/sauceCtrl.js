const Sauce = require('../models/sauce');


exports.allSauces = (req, res, next) => {
    Sauce.find()
    .then( sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));

    // const truc = [
    //     {
    //         userId: '123',
    //         name: 'ABC',
    //         manufacturer: 'DEF',
    //         description: 'LOREM',
    //         mainPepper: 'Piment rouge',
    //         imageUrl: 'https://us.123rf.com/450wm/belchonock/belchonock1803/belchonock180366380/97870921-bol-en-c%C3%A9ramique-avec-sauce-tomate-et-ingr%C3%A9dients-sur-table-en-bois.jpg?ver=6',
    //         heat: 2,
    //         likes: 0,
    //         dislikes: 0,
    //         userLiked: [],
    //         userDisliked: []
    //     }
    // ];
    ;
};

exports.newSauce = (req, res, next) => {
    sauceObject = JSON.parse(req.body.sauce);

    sauceObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    sauceObject.likes = 0;
    sauceObject.dislikes = 0;
    sauceObject.userLiked = [];
    sauceObject.userDisliked = [];
    const sauce = new Sauce({ ...sauceObject });
    console.log(req.body.sauce);
    console.table(sauceObject);

    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée' }))
        .catch();

};