const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
dotenv.config();

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACESS_KEY
})


class Usuario {
    constructor() {
        this.db = new AWS.DynamoDB.DocumentClient();
        this.TABLE = 'lincros-usuario';
    }

    async criarUsuario(formData) {
        const senhaCriptografada = await this.criptografarSenha(formData.DS_SENHA);
        formData.DS_SENHA = senhaCriptografada;
        const params = {
            TableName: this.TABLE,
            Item: formData
        };

        if (await this.getUsuario(formData.NM_USUARIO)) {
            return 'Usuário já existe'
        } else {
            try {
                await this.db.put(params).promise();
                return 'Usuário criado com sucesso!'
            } catch (error) {
                console.error('Erro ao criar usuário:', error);
                throw error;
            }
        }
    }

    async criptografarSenha(senha) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(senha, salt);
        return hash
    }

    async logarUsuario(formData) {
        const usuario = await this.getUsuario(formData.NM_USUARIO)
        const senhaValida = await bcrypt.compare(formData.DS_SENHA, usuario.DS_SENHA);

        try {
            if (senhaValida) {
                const token = jwt.sign({ NM_USUARIO: usuario.NM_USUARIO }, process.env.JWT_SECRET, { expiresIn: '10h' });

                return {
                    loginSucedido: true,
                    token: token,
                    usuario: {
                        NM_USUARIO: usuario.NM_USUARIO,
                        DS_NOME: usuario.DS_NOME
                    }
                }
            } else {
                return {
                    mensagem: 'Usuário ou senha inválidos',
                    loginSucedido: false
                }
            }
        } catch (error) {
            console.error('Erro ao logar:', error);
            throw error;
        }
    }

    async getUsuario(nmUsuario) {
        const params = {
            TableName: this.TABLE,
            Key: { NM_USUARIO: nmUsuario }
        };

        try {
            const usuario = await this.db.get(params).promise();
            return usuario.Item;
        } catch (error) {
            console.error('Erro ao obter usuário:', error);
            throw error;
        }
    }

}

module.exports = Usuario;
