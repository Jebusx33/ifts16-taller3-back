'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'a';

exports.createToken = function (user) {
    //cracion del token
    var payload = {//datos del usuario
        sub: user._id,
        nombres: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        role: user.rol,
        iat: moment().unix(),
        exp: moment().add(7, 'days').unix() //tiempo de exiracion 1 semana
    }
    return jwt.encode(payload, secret)
}



