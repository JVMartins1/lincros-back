# lincros-back

Backend		

	configurar .env com as seguintes chaves
		ACCESS_KEY - Chave de acesso para a AWS.
		SECRET_ACCESS_KEY - Chave secreta correspondente à chave de acesso para a AWS.
		AWS_REGION - Região da AWS a ser utilizada pelo aplicativo.
		JWT_SECRET - Chave secreta para a geração e validação de tokens JWT.
	
	npm install
	npm start

	Depenências
		AWS SDK
		Jsonwebtoken
		Bcrypt
		Cors
		Dotenv
		Express
		Uuid

		
	Utilizado nodeJs, realiza operações de Read, Write e Delete para as tabelas de usuários e pedidos, além de criptografia de senha e utilização de token de autorização.

	UsuarioToken (Middleware)
		verificarToken - Verifica se o token fornecido é válido, expirado ou inválido. Caso o token estiver expirado o frontend realiza o logout do usuário.

	Usuario
		criarUsuario (formData) - Verifica se o usuário já possui cadastro no sistema, e caso não existir, cria o mesmo.
		criptografarSenha (senha) - Criptografa a senha do usuário utilizando bcrypt.
		logarUsuario (formData) - Consulta dados do usuário e valida senha idependente se o usuario for encontrado ou não. Caso a senha fornecida for válida, loga usuário, caso contrário informa que as credenciais estão inválidas.
		getUsuario (nmUsuario) - Realiza consulta de todas informações do usuário fornecido.

	Pedido
		criarPedido(formData) - Cria pedidos e atribui um uuid ao mesmo
		getPedidosUsuario(nmUsuario) - Realiza consulta de todos pedidos de um usuário
		atualizarNomePedido(formData) - Altera o nome de um pedido
		deletarPedidos(nmUsuario) - Deleta todos pedidos de um usuário
