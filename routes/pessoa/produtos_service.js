// Importar o módulo express
const express = require('express');

// Extraíndo a função Router do módulo express
const router = express.Router();

// Importar módulo de serviços
const pessoa_service = require('../../service/pessoa/pessoaService');

// *** ADICIONE SUAS ROTAS AQUI

// Rota principal
router.get('/', function (req, res) {
    pessoa_service.formularioCadastro(req, res);
});

// Rota principal contendo a situação
router.get('/:situacao', function (req, res) {
    pessoa_service.formularioCadastroComSituacao(req, res);
});
//Rota de listagem
router.get('/listar/:categoria', function (req, res) {
    pessoa_service.listagemPessoa(req, res)
})

//Rota de pesquisa
router.post('/pesquisa', function (req, res) {
    pessoa_service.pesquisa(req, res);
})

// Rota de cadastro
router.post('/cadastrar', function (req, res) {
    pessoa_service.cadastrarPessoa(req, res);
});


// Rota para redirecionar para o formulário de alteração/edição
router.get('/formularioEditar/:id', function (req, res) {
    pessoa_service.formularioEditar(req, res)
});

// Rota para editar pessoa
router.post('/editar', function (req, res) {
    pessoa_service.editarPessoa(req,res);
});
router.delete('/remover/:id', function (req, res){
    pessoa_service.removerPessoa(req, res)
});

// Exportar o router
module.exports = router;