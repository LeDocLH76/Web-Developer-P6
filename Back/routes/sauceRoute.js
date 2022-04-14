const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauceCtrl');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/sauces', auth, sauceCtrl.allSauces);
router.get('/sauces/:id', auth, sauceCtrl.oneSauce);
router.post('/sauces', auth, multer, sauceCtrl.newSauce);
router.put('/sauces/:id', auth, multer, sauceCtrl.updateSauce);
router.delete('/sauces/:id', auth, sauceCtrl.deleteSauce);

router.post('/sauces/:id/like',auth, sauceCtrl.likeSauce);

module.exports = router;