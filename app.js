import express from 'express';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mainRouter from './routers/mainRouter';
import User from './models/userModel';


const app = express();
const port = process.env.PORT || 3000;


app.use(session({
    secret: "CHANGEME",
    resave: false,
    saveUninitialized: false 
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, './static')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());

app.use('/', mainRouter);

app.listen(port, (err) => {
    if (err)
        console.error(err);
    else
        console.log(`Listening on port ${port}...`)
});