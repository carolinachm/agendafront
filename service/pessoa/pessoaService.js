// Importação do pool de conexões do banco de dados
const pool = require('../../db/configDB').pool;
// Importação do módulo file system, apesar de não ser usado no código fornecido
const fs = require('fs');

// Função para exibir o formulário de cadastro de pessoas
function formularioCadastro(req, res){
    // Definição da consulta SQL para selecionar todas as pessoas
    let sql = 'SELECT * FROM pessoa';
    // Execução da consulta SQL
    pool.query(sql, function (erro, retorno) {

        // Renderiza a página do formulário, passando os dados das pessoas
        res.render('formulario', { pessoas: retorno.rows });
    });
}

// Função para exibir o formulário de cadastro de pessoas com situação específica
function formularioCadastroComSituacao(req, res){
    // Consulta SQL para selecionar todas as pessoas
    let sql = 'SELECT * FROM pessoa';
    // Execução da consulta
    pool.query(sql, function (erro, retorno) {
        // Renderiza a página do formulário com dados das pessoas e a situação especificada
        res.render('formulario', { pessoa: retorno.rows, situacao: req.params.situacao });
    });
}

// Função para exibir o formulário de edição de pessoa
function formularioEditar(req, res){
    // Uso de placeholders para prevenir injeção de SQL
    let sql = `SELECT * FROM pessoa WHERE id = $1`;
    // Execução do comando SQL com segurança
    pool.query(sql, [req.params.id], function (erro, retorno) {
        if (erro) throw erro;
        // Renderiza o formulário de edição com os dados da pessoa selecionada
        // Aqui havia um erro, retorno[0].rows não é válido; o correto é retorno.rows
        res.render('formularioEditar', { pessoa: retorno.rows[0]});
    });
}

// Função para listar pessoas
function listagemPessoa(req, res){
    let nome = req.params.nome;
    let sql = '';
    // Diferencia a consulta SQL com base no parâmetro nome
    if(nome == 'todos'){
        sql = `SELECT * FROM pessoa ORDER BY RANDOM()`;
    }else{
        // Uso de placeholders para prevenir injeção de SQL
        sql = `SELECT * FROM pessoa WHERE nome = $1 ORDER BY nome ASC`;
        pool.query(sql, [nome], function(erro, retorno){
            res.render('listar', {pessoa: retorno.rows})
        });
        return; // Adiciona return para evitar execução duplicada
    }
    // Executa caso 'nome' seja 'todos'
    pool.query(sql, function(erro, retorno){
        res.render('listar', {pessoa: retorno.rows});
    });
}

// Função para pesquisar pessoas
function pesquisa(req, res){
    let termo = req.body.termo;
    // Uso de placeholders para prevenir injeção de SQL
    let sql = `SELECT * FROM pessoa WHERE nome LIKE $1`;
    // Execução da pesquisa com segurança
    pool.query(sql, [`%${termo}%`], function (erro, retorno) {
        let semRegistros = retorno.rowCount == 0;
        res.render('listar', { pessoa: retorno.rows, semRegistros: semRegistros });
    });
}

// Função para cadastrar pessoa
function cadastrarPessoa(req, res){
    try {
        let { nome, sobrenome, data_Nascimento, cpf, email } = req.body;
        if (nome == '' || sobrenome == '' || data_Nascimento == '' || cpf == '' || email == '') {
            res.redirect('/falhaCadastro');
            return;
        }
        // Uso de placeholders para prevenir injeção de SQL
        let sql = `INSERT INTO pessoa (nome, sobrenome, data_Nascimento, cpf, email) VALUES ($1, $2, $3, $4, $5)`;
        pool.query(sql, [nome, sobrenome, data_Nascimento, cpf, email], function (erro, retorno) {
            if (erro) throw erro;
            res.redirect('/okCadastro');
        });
    } catch (erro) {
        res.redirect('/falhaCadastro');
    }
}

// Função para remover pessoa
function removerPessoa(req, res){
    try {
        // Uso de placeholders para prevenir injeção de SQL
        let sql = `DELETE FROM pessoa WHERE id = $1`;
        pool.query(sql, [req.params.id], function (erro, retorno) {
            if (erro) throw erro;
            res.redirect('/okRemover');
        });
    } catch (erro) {
        res.redirect('/falhaRemover');
    }
}

// Função para editar pessoa
function editarPessoa(req, res){
    let { id, nome, sobrenome, data_Nascimento, cpf, email } = req.body;
    if (nome == '' || sobrenome == '' || data_Nascimento == '') {
        res.redirect('/falhaEdicao');
        return;
    }
    try {
        // Uso de placeholders para prevenir injeção de SQL
        let sql = `UPDATE pessoa SET nome=$1, sobrenome=$2, data_Nascimento=$3, cpf=$4, email=$5 WHERE id=$6`;
        pool.query(sql, [nome, sobrenome, data_Nascimento, cpf, email, id], function (erro, retorno) {
            if (erro) throw erro;
            res.redirect('/okEdicao');
        });
    } catch (erro) {
        res.redirect('/falhaEdicao');
    }
}

// Exportação das funções para uso externo
module.exports = {
    formularioCadastro,
    formularioCadastroComSituacao,
    formularioEditar,
    listagemPessoa,
    pesquisa,
    cadastrarPessoa,
    removerPessoa,
    editarPessoa
};
