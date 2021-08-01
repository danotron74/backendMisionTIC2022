//Middleware de autenticacion;
// const tokenService = require('../services/token');
var jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.js');
const megaKey = require('../database/db.js').secretOrKey;

const checkToken = async (token) => {
    const _id = null;
    try {
        const { _id } = await jwt.decode(token);
        _id = _id;
    } catch (error) {
        return false
    } 
    const user = await models.Usuario.findOne({ where: {_id: _id}});
    if (user) {
        const tok = jwt.sign({ _id: user._id},megaKey,{expiresIn:'1d'});
        return { tok ,name: user.name };
    } else {
        return false;
    }
}

decode = async(token) => {
    try {
        const { _id } = await jwt.verify(token, megaKey);
        const user = await Usuario.findOne({ where: { _id: _id } });
        if (user) {
            return user;
        } else {
            return false;
        }
    } catch (e) {
        const tokenNuevo = await checkToken(token);
        return tokenNuevo;
    }

}

module.exports = {
    verifyUsuario: async(req, res, next) => {
        if (!req.headers.token) {
            return res.status(404).send({
                message: 'No token'
            });
        }
        const response = await decode(req.headers.token);
        next()
    },
}