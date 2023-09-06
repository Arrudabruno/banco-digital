const express = require('express')
const roteador = express()
const controlador = require('./Controladores/contas')

roteador.get('/contas', controlador.listarContas)
roteador.post('/contas', controlador.adicionarConta)
roteador.put('/contas/:numeroConta/usuario', controlador.modificarConta)
roteador.delete('/contas/:numeroConta', controlador.excluirConta)
roteador.post('/transacoes/depositar', controlador.depositar)
roteador.post('/transacoes/sacar', controlador.sacar)
roteador.post('/transacoes/transferir', controlador.transferir)
roteador.get('/contas/saldo', controlador.saldo)
roteador.get('/contas/extrato', controlador.extrato)


module.exports = roteador