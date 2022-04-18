const { MulterError } = require('multer');
const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}
console.log('Je suis multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        console.log('Destination');
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        console.log('Filename');
        const name = file.originalname.split(' ').join('_').split('.')[0];
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }

})



module.exports = multer({ storage }).single('image');