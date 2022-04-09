const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauceCtrl')

router.get('/sauces', sauceCtrl.allSauces);
router.post('/sauces', sauceCtrl.newSauce);

module.exports = router;