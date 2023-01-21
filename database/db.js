const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);

const clientDB = mongoose
        .connect(process.env.URI)
        .then((m)=> {
            console.log('db conectada');
            return m.connection.getClient(); // devuelve el cliente usado en mongo
        })
        .catch((e)=> console.log('fallo la conexion ' + e));

module.exports = clientDB;