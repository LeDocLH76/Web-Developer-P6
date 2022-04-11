const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauceCtrl');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/sauces', sauceCtrl.allSauces);
router.post('/sauces', multer, sauceCtrl.newSauce);
router.get('/sauces/:id', sauceCtrl.oneSauce);
router.put('/sauces/:id', multer, sauceCtrl.updateSauce);
router.delete('/sauces/:id', sauceCtrl.deleteSauce);

module.exports = router;