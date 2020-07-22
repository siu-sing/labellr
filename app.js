const express = require('express');
const mongoose = require('mongoose');
const expressEjsLayouts = require('express-ejs-layouts');

const app = express();
const passport = require("./config/passportConfig");
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require("method-override");
const checkUser = require('./config/checkUser');
require("dotenv").config();

//Connect to MongoDB
mongoose.connect(
    process.env.MONGODBLIVE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false, //solves deprecation warning
        useCreateIndex: true,
    },
    () => {
        console.log("Mongodb connected");
    }
);

//Look for static files in public
app.use(express.static("public")); 

//Middleware
app.use(express.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(expressEjsLayouts);

app.use(methodOverride("_method"));

/*-- These must be place in the correct place */
app.use(
    session({
      secret: process.env.SECRET,
      saveUninitialized: true,
      resave: false,
      cookie: { maxAge: 360000 }
    })
  );

//-- passport initialization
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(request, response, next) {
  // before every route, attach the flash messages and current user to res.locals
  response.locals.alerts = request.flash();
  response.locals.currentUser = request.user;
  next();
});

//MAIN INDEX
app.get('/', (req, res) => {
    res.render('index');
});

//ALL ROUTES
app.use('/auth', require('./routes/auth.routes'));
app.use('/client', checkUser.isClient, require('./routes/client.routes'));
app.use('/admin', checkUser.isAdmin, require('./routes/admin.routes'));
app.use('/labeller', checkUser.isLabeller, require('./routes/labeller.routes'));

app.listen(process.env.PORT, () =>
  console.log(`connected to express on ${process.env.PORT}`)
);
///