const express = require('express');
const bodyParser = require('body-parser');
const Usuario = require('./classes/Usuario');
const Pedido = require('./classes/Pedido')
const UsuarioToken = require('./classes/UsuarioToken')
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = 8001;

app.use(bodyParser.json());

const usuario = new Usuario();
const pedido = new Pedido();
const token = new UsuarioToken();

app.post('/usuarios/registrar', async (req, res) => {
    try {
        const novoUsuario = req.body;
        const resp = await usuario.criarUsuario(novoUsuario);

        if(resp == 'Usuário já existe'){
            res.status(409).json({ message: resp });
        }else{
            res.status(201).json({ message: resp });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
});

app.post('/usuarios/login', async (req, res) => {
    try {
        const resp = await usuario.logarUsuario(req.body);

        if(resp.mensagem == 'Usuário ou senha inválidos'){
            res.status(401).json({ message: resp });
        }else{
            res.status(200).json({ message: resp });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro no login.' });
    }
});

app.post('/pedidos/criar', token.verificarToken, async (req, res) => {
    try {
        req.body.NM_USUARIO = req.usuario.NM_USUARIO;
        const resp = await pedido.criarPedido(req.body);
        res.status(201).json({ message: resp });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar pedido.' });
    }
});

app.post('/pedidos/deletar', token.verificarToken, async (req, res) => {
    try {
        const nmUsuario = req.usuario.NM_USUARIO;
        const resp = await pedido.deletarPedidosUsuario(nmUsuario);
        res.status(201).json({ message: resp });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar pedidos.' });
    }
});

app.post('/pedidos/editarNome', token.verificarToken, async (req, res) => {
    try {
        req.body.NM_USUARIO = req.usuario.NM_USUARIO;
        const resp = await pedido.atualizarNomePedido(req.body);
        res.status(201).json({ message: resp });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar pedidos.' });
    }
});

app.get('/pedidos/listarPedidos/',token.verificarToken, async (req, res) => {
    try {
        const resp = await pedido.getPedidosUsuario(req.usuario.NM_USUARIO);
        res.status(201).json(resp);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter pedidos.' });
    }
});

app.listen(PORT);
