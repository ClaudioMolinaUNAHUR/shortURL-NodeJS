const express = require('express');
const router = express.Router()

router.get('/', (req, res) =>{
    const urls = [
        {origin: "www.google.com/algo", shortUrl: "sdasdas"},
        {origin: "www.google.com/nada", shortUrl: "sdasdas"},
        {origin: "www.google.com/todo", shortUrl: "sdasdas"},
    ] 
    res.render('home', {urls: urls}) // renderizo home desde la carpeta views
});

module.exports = router