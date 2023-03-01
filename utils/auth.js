const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

exports.isAuth = async (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const isCustomAuth = token.length < 400;

        let decodeData;

        //if token is custom token do this
        if(token && isCustomAuth) {
            decodeData = jwt.verify(token, process.env.SECRET_KEY);
            req.userId = decodeData?.id;

        }else{
            decodeData = jwt.decode(token);
            req.userId = decodeData?.sub;

        }
        return next();
    }catch(error){
        res.status(401).send({message: 'Not authorized'})
    }
};
