
const express = require('express');
const router = express.Router();

module.exports = function (passport, User) {
    
    // 1- un user signup 
    router.post('/signup', async (req, res, next) => {
        
        const { username, password, confirm_password } = req.body
        
        if (password.length < 8 || password !== confirm_password) {
            return res.status(400).send('The password is less than 8 character or not equal to the confirm password');
        }
        try {
            // 2- je l'enregistre dans la db
            const user = await User.create({
                username,
                password,
            });
            // 3- je l'authentifie pour créer une session et le redirigé vers la page d'admin
            req.login(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/');
              });
        } catch(err) {
            console.log(err);
            res.status(500).send(err);
        }
    });
    
    
    router.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }))

    router.get('/logout', (req, res, next) => {
        req.logout();
        res.redirect('/login');
    })
    
    return router
}    

