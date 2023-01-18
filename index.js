const express = require('express');
const session = require('express-session');
const flash = require('connect-flash'); // mensajes que viven una sola vez
const passport = require('passport');
const { create } = require('express-handlebars');
const csrf = require('csurf');

const homeRoute = require("./routes/home");
const loginRoute = require("./routes/auth");
const User = require('./models/User');

require('dotenv').config(); // importamos variables de entorno. config() puede llevar configuracion para cambiar el nombre a .env
require('./database/db') // importamos la db

const app = express(); // inicializo express

app.use(//configuarion de session-express, se almacena en memoria RAM
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
        name: "secret-name-blablabla"
    })
);

app.use(flash()); // iniciar flash

app.use(passport.initialize()); 
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, {id: user._id, userName: user.userName}); // nos permite crear una sesion para un usuario
}); // luego se agarra de req.user
passport.deserializeUser(async(user, done)=> {
    const userDB = await User.findById(user.id); 
    return done(null, {id: userDB._id, userName: userDB.userName}); //actualiza el usuario si se modifico, pero antes verifica si existe el user en la DB
})

//extname: cambiar extencion de .handlebars a .hbs
//partialsDir: permite separar en componentes los objetos web, simil react o angular
const hbs = create({
    extname: ".hbs",
    partialsDir: ['views/components']
})

app.engine(".hbs", hbs.engine); // motor de plantilla
app.set("view engine", ".hbs");  // tipo de extension  q va usar el motor
app.set("views", "./views"); // y donde estan los archivos del motor

//use es un middle, si lo pongo antes de renderizar views, se va a ejecutar primero
app.use(express.static(__dirname + '/public')); //ruta public (FRONTEND) 
app.use(express.urlencoded({ extended:true })); //habilitar el form, osea lo que venga de body

app.use(csrf()); // generador de token para formularios
app.use((req, res, next) => {
    // declaro variables globales / csrfToken, envia token en cada consulta / mensajes, tengo 2 partes q a parte de renderizar envian variables al front, con esto lo omito
    res.locals.csrfToken = req.csrfToken(); // estoy diciendo, q antes de cada de cada operacion, envio Tokens como respuesta y se puede consultar luego
    res.locals.mensajes = req.flash("mensajes");
    next();
});

app.use("/", homeRoute);
app.use("/auth", loginRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{ console.log('server on port: ' + PORT)});