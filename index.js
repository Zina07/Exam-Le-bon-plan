const express = require("express");
const exphbs = require("express-handlebars");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo")(expressSession);
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
// models 
const User = require('./models/user');
const Product = require('./models/product');

// Declare routes
const authRoute = require('./controller/auth')
const viewRoute = require('./controller/views')
const productRoute = require('./controller/products');
const profileRoute = require('./controller/profile');

const port = process.env.PORT || 3000;
mongoose.connect("mongodb://localhost:27017/lebonplan",
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    }
);


const app = express();
// Express configuration
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// Configuration de la session (cookie) pour l'auth
app.use(
    expressSession({
        secret: "konexioasso07",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
);

// Initialisation de passport pour l'authentification et l'authorization des routes
app.use(passport.initialize());
app.use(passport.session());

// Strategy pour authentification direct avec email et password
passport.use(new LocalStrategy(async function (username, password, done) {
    // User.authenticate() => Methode de passport-local-mongoose
    try {
        // 1- Je le trouve dans la DB
        const user = await User.findOne({ username }).lean().exec();
        if (!user) {
            return done(null, false, { message: 'This user was not found'});
        }
        // 2- Que son password est le même que celui trouvé dans la DB
        if (user.password !== password) {
            return done(null, false, { message: 'The password is incorrect'});
        }
        // 3- Si tout est bon, je renvoie l'utilisateur
        done(null, user);
    } catch(err) {
        console.log('[Error in local strat]', err)
        done(err);
    }
}));



passport.serializeUser(function(user, done) {
    // J'enregistre l'id mongoose, mais ça aurait très bien pu être un email
    // Il nous faut simplement un attribut unique qui nous permet d'identifier l'utilisateur
    done(null, user._id)
});

passport.deserializeUser(async function(id, done) {
    // Ici je récupère l'id qui a été renseigné dans le serialize user
    try {
        const user = await User.findById(id).exec()
        done(null, user);
    } catch(err) {
        done(err);
    }
});

// declaration de toutes les routes de l'api
app.use('/auth', authRoute(passport, User));
app.use('/products', productRoute(passport, Product));
app.use('/profile', profileRoute(passport, Product));
app.use('/', viewRoute);

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});