const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACESS_KEY
})


class UsuarioToken {
    constructor() {
        this.db = new AWS.DynamoDB.DocumentClient();
        this.TABLE = 'lincros-usuario-token';
    }

    verificarToken(req, res, next){
        const authHeader = req.header('Authorization');

        const token = authHeader.split(' ')[1];

        if(!authHeader){
            return res.status(401).json({ mensagem: 'Token não fornecido.'});
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.usuario = decoded;
            next();
        } catch (error) {
            if(error.name == "TokenExpiredError"){
                return res.status(401).json({ mensagem: 'Token expirado.'});
            }else{
                res.status(400).json(error)
            }
        }

    }

}

module.exports = UsuarioToken;
