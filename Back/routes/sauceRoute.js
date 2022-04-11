const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauceCtrl');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/sauces', sauceCtrl.allSauces);
router.post('/sauces', multer, sauceCtrl.newSauce);

module.exports = router;