const Sauce = require('../models/sauce');


exports.allSauces = (req, res, next) => {
    const truc = [
        {
            userId: '123',
            name: 'ABC',
            manufacturer: 'DEF',
            description: 'LOREM',
            mainPepper: 'Piment rouge',
            imageUrl: 'https://us.123rf.com/450wm/belchonock/belchonock1803/belchonock180366380/97870921-bol-en-c%C3%A9ramique-avec-sauce-tomate-et-ingr%C3%A9dients-sur-table-en-bois.jpg?ver=6',
            heat: 2,
            likes: 0,
            dislikes: 0,
            userLiked: [],
            userDisliked: []
        }
    ];
    res.status(200).json(truc);
};

exports.newSauce = (req, res, next) => {
    console.log(req);
    return res.status(201).json({ message: 'Sauce transmise'});
}