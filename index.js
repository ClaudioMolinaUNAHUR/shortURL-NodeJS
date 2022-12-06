const express = require('express');
const { create } = require('express-handlebars');
const homeRoute = require("./routes/home");
const loginRoute = require("./routes/auth");

const app = express(); // inicializo express

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
app.use("/", homeRoute);
app.use("/auth", loginRoute);


app.listen(5000, ()=>{ console.log('server ON')});