const express= require('express');

const router = express.Router()


module.exports = function (passport, Product) {
    router.get('/', async (req, res, next) => {
        if (req.isAuthenticated()) {
            const products = await Product.find({userId: req.user._id}).lean().exec()
            res.render('profile', {
                isAuthenticated: true,
                username: req.user.username,
                products
            });
        } else {
            res.redirect('/home')
        }
    })

    return router
}