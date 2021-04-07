const express = require('express');
const router = express.Router();
const { calculateAge } = require('../services/common')


router.get('/', (req, res, next) => {

    // 1- Vérifier si l'utilisateur est authentifé ou pas

    // 2- Je dois envoyé cette information à mon template

    // Mon req.user n'est pas accessible lorsqu'il n'est pas authentifié
    // res.render('home', {
    //     username: req.isAuthenticated() ? req.user.username : '',
    //     isAuthenticated: req.isAuthenticated()
    // });
    if (req.isAuthenticated()) {
        res.render('home', {
            username: req.user.username ,
            isAuthenticated: req.isAuthenticated()
        })
    } else {
        res.render('home', {
            username: null,
            isAuthenticated: false
        })
    }
})

router.get('/signup', (req, res, next) => {
    res.render('signup');
})

router.get('/login', (req, res, next) => {
    res.render('login');
})

// route protégé par authorization par session
router.get('/admin', (req, res, next) => {
    // La méthode isAuthenticated est fournie par passport,
    // elle aura une valeur de true si la session est active
    if (req.isAuthenticated()) {
        // Si l'utilisateur est authentifié, nous avons accès à l'objet req.user passé par les middlewares de passport antérieur
        console.log('in /admin', req.user)
        return res.render('admin', {
            username: req.user.username,
            isAuthenticated: req.isAuthenticated()
        })
    }
    // Si l'utilisateur n'est pas authentifié, on le redirige vers la page d'admin
    res.redirect('/login');
})


module.exports = router;

