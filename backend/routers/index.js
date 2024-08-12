const express = require('express');


const router = express.Router();
router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.use('/flashcard', require('./flashcard'));
router.use('/user', require('./user'));

module.exports = router;
