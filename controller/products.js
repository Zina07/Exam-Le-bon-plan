const express = require('express');
const multer = require('multer');
const router = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const { username } = req.user;
        const productName = req.body.name;
        // username_data
        const date = new Date();
        const dateYYYYMMDD = date.toISOString().substring(0, 10);
        const extension = file.originalname.split('.').pop();
        const filename = `${username}_${productName}_${dateYYYYMMDD}.${extension}`;
        cb(null, filename);
    }
})
const upload = multer({ storage: storage });

module.exports = function (passport, Product) {


    router.get('/:id', async (req, res, next) => {
        try {
            const product = await Product.findById(req.params.id).lean().exec()
            res.render('product', {
                product,
                isAuthenticated: req.isAuthenticated(),
                username: req.isAuthenticated() ? req.user.username: null
            })
        } catch(err) {
            res.status(500).send(err)
        }
        
    })


    router.get('/cities/:city', async (req, res, next) => {
        try {
            // on récupère les produits de la ville entré en url params
            const products = await Product.find({ cities: req.params.city }).lean().exec();
            res.render('listProducts', {
                products,
                isAuthenticated: req.isAuthenticated(),
                username: req.isAuthenticated() ? req.user.username: null
            });
        } catch(err) {
            console.error(err)
            res.status(500).send(err)
        }
    })


    // Cette route ne doit être accessible que si l'utilisateur est loggué
    router.post('/', upload.single('image'), async (req, res, next) => {
        if (req.isAuthenticated()) {
            try {
                const product = await Product.create({
                    ...req.body,
                    pictureUrl: `http://localhost:3000/uploads/${req.file.filename}`,
                    userId: req.user._id
                })
                res.redirect('/');
            } catch (err) {
                console.log(err)
                res.status(500).send(err)
            }
        } else {
            res.redirect('login')
        }

    })

    return router
};