const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    // N'autorise à poursuivre que si le userId de l'utilisateur et celui de son TOKEN sont identique
    // à condition que le TOKEN ne soit pas expiré ou absent
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
        const userId = decodedToken.userId;
            if (req.body.userId && req.body.userId !== userId) {
                throw 'User ID non valide.';
            }else{
                next();
            }
            
    }catch ( error ) {
        res.status(401).json({ error: error | 'Requête non authentifiée.'});
    }
}