const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config.js');

module.exports = {

    privateUser : async (req, res, next) => {
        if(!req.headers || req.headers.user_id === ""  || req.headers.authorization === ""){
            return res.status(401).send({id: 'invalid-header', msg:'Headers Empty'});
        }
        
        authentication(req, res, next);
        
    },

}

function authentication(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({id: 'invalid-token', msg:'No token provided'});
    }

    const parts = authHeader.split(' ');

    if(!parts.length === 2){
        return res.status(401).send({id: 'invalid-token', msg:'Token error'});
    }

    const [scheme, token] = parts;
    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send({id: 'invalid-token', msg:'Token malformatted'});
    }
    

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err){
            return res.status(401).send({id: 'invalid-token', msg:'Token invalid'});
        }
        req.userId = decoded.params.id;

        return next();
    });
}