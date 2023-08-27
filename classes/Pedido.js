const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
dotenv.config();

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACESS_KEY
})

class Pedido {
    constructor() {
        this.db = new AWS.DynamoDB.DocumentClient();
        this.TABLE = 'lincros-pedido';
    }

    async criarPedido(formData) {

        formData.ID_PEDIDO = uuidv4();

        const params = {
            TableName: this.TABLE,
            Item: formData
        };

        try {
            await this.db.put(params).promise();
            return 'Pedido criado com sucesso!'
        } catch (error) {
            console.error('Erro ao criar pedido:', error);
            throw error;
        }
    }


    async getPedidosUsuario(nmUsuario) {
        const params = {
            TableName: this.TABLE,
            KeyConditionExpression: 'NM_USUARIO = :nmUsuario',
            ExpressionAttributeValues: {
                ':nmUsuario': nmUsuario
            }

        };

        try {
            const pedido = await this.db.query(params).promise();
            return pedido.Items;
        } catch (error) {
            console.error('Erro ao obter pedidos:', error);
            throw error;
        }
    }


   async deletarPedidosUsuario(nmUsuario) {
        try {
            const queryResult = await this.getPedidosUsuario(nmUsuario);

            const deletePromises = queryResult.map(async (item) => {
                const deleteParams = {
                    TableName: this.TABLE,
                    Key: {
                        NM_USUARIO: item.NM_USUARIO,
                        ID_PEDIDO: item.ID_PEDIDO
                    }
                };
                await this.db.delete(deleteParams).promise();
            });
    
            await Promise.all(deletePromises);
    
            return 'Pedidos deletados com sucesso!';
        } catch (error) {
            console.error('Erro ao deletar pedidos:', error);
            throw error;
        }
    }
    

    async atualizarNomePedido(formData) {
        const { ID_PEDIDO, NM_PEDIDO, NM_USUARIO } = formData;

        const updateParams = {
            TableName: this.TABLE,
            Key: {
                NM_USUARIO: NM_USUARIO,
                ID_PEDIDO: ID_PEDIDO
            },
            UpdateExpression: 'set NM_PEDIDO = :novoNome',
            ExpressionAttributeValues: {
                ':novoNome': NM_PEDIDO
            },
            ReturnValues: 'ALL_NEW'
        };

        try {
            const updatedPedido = await this.db.update(updateParams).promise();
            return updatedPedido;
        } catch (error) {
            console.error('Erro ao atualizar nome do pedido:', error);
            throw error;
        }
    }

}

module.exports = Pedido;