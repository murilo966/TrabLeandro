# Lumber Tycoon 2 – Catálogo de Machados

## Tema escolhido
Sistema de catálogo e gerenciamento de machados do jogo **Lumber Tycoon 2**, desenvolvido com Node.js, Express, EJS e MySQL.

O sistema permite cadastrar, consultar, editar, excluir e pesquisar machados, além de organizar as informações por categoria e raridade.

## Instalação

1. Clone ou baixe o projeto.
2. Abra a pasta no terminal.
3. Instale as dependências:

```bash
npm install
```

4. Configure o arquivo `.env` na raiz do projeto:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=lumbertycoon2
PORT=3000
```

5. Execute o script SQL disponibilizado no projeto para criar o banco de dados e suas tabelas.

## Execução

Inicie o servidor com:

```bash
npm start
```

Acesse no navegador:

```text
http://localhost:3000
```

## Funcionalidades

- Cadastro de machados.
- Consulta e listagem de registros.
- Edição e exclusão de machados.
- Pesquisa por nome, categoria e raridade.
- Notificações de sucesso e erro nas operações.