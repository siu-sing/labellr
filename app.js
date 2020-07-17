const express = require('express');
const mongoose = require('mongoose');
const expressEjsLayouts = require('express-ejs-layouts');
const app = express();
const passport = require("./config/passportConfig");
const session = require('express-session');
const flash = require('connect-flash');


require("dotenv").config();


mongoose.connect(
    process.env.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false, //solves deprecation warning
        useCreateIndex: true,
    },
    () => {
        console.log("Mongodb connected");
    }
);

app.use(express.static("public")); //look for static files in public
app.use(express.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(expressEjsLayouts);

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

app.get('/', (req, res) => {
    res.render('index');
});


app.listen(process.env.PORT, () =>
  console.log(`connected to express on ${process.env.PORT}`)
);
