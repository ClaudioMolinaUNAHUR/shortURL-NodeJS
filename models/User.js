const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {Schema} = mongoose;

const userSchema = new Schema({
    userName: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        index: {unique: true}
    },
    password: {
        type: String,
        required: true
    },
    tokenConfirm: {
        type: String,
        default: null
    },
    cuentaConfirm: {
        type: Boolean,
        default: false
    },
    imagen:{
        type: String,
        default: null
    }
})

//PRE permite que antes de 'save' hago algo antes
userSchema.pre('save', async function(next){
    const user = this
    if(!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt)
        user.password = hash
        next();
    } catch (error) {
        console.log(error)
    }
})

//agrego un metodo al esquema
userSchema.method('comparePassword', async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password) //this se refiere uno de los datos del esquema en la DB, candidate es la password, que viene del body
})

//creamos el modelo en mongoDB
const User = mongoose.model('User', userSchema);

module.exports = User;