const express = require('express');
const router = express.Router()

router.get('/login', (req, res) =>{ 
    res.render('login') // renderizo home desde la carpeta views
});

module.exports = router