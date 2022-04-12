const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauceCtrl');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/sauces', sauceCtrl.allSauces);
router.get('/sauces/:id', sauceCtrl.oneSauce);
router.post('/sauces', auth, multer, sauceCtrl.newSauce);
router.put('/sauces/:id', auth, multer, sauceCtrl.updateSauce);
router.delete('/sauces/:id', auth, sauceCtrl.deleteSauce);

router.post('/sauces/:id/like',sauceCtrl.likeSauce);

module.exports = router;