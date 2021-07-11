const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config.js');

module.exports = {

    privateUser : async (req, res, next) => {
        if(!req.headers || req.headers.user_id === ""  || req.headers.authorization === ""){
            return res.status(401).send({errorMessage:'Headers Empty', data: 401});
        }
        
        authentication(req, res, next);
        
    },

}

function authentication(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({errorMessage:'No token provided', data: 401});
    }

    const parts = authHeader.split(' ');

    if(!parts.length === 2){
        return res.status(401).send({errorMessage:'Token error' , data: 401});
    }

    const [scheme, token] = parts;
    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send({errorMessage:'Token malformatted', data: 401});
    }
    

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err){
            return res.status(401).send({errorMessage:'Token invalid', data: 401});
        }
        req.userId = decoded.params.id;

        return next();
    });
}