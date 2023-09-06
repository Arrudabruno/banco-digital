# Banco-Digital
Projeto feito para realização do desafio do segundo módulo do curso da Cubos Academy.

## O projeto é capaz de:

- **Listar todas as contas** (apenas para quem possuir a senha master).
- **Adicionar conta**
- **Modificar conta**
- **Excluir conta**
- **Depositar**
- **Sacar**
- **Transferir entre contas**
- **Consultar saldo**
- **Consultar extrato**

## Como testar o código!

1º Abra o terminal na pasta raiz do projeto e rode o código ```npm install``` para que ele instale as bibliotecas que serão utilizadas;

2º Rode o código ```npm run dev``` para iniciar o servidor;

3 º De preferência use o [Insomnia](https://insomnia.rest/download) para fazer as requisições ao servidor.

## Os testes serão feitos em servidor local, por isso será utilizado o endereço:  
> http://localhost:3000 >
Portanto utilize esse endereço antes de todas as rotas listadas abaixo.

- ## **Listar todas as contas** 
Para listar as contas será necessário passar como parâmetros query a senha geral ```Cubos123Bank```
Atravéz do seguine endereço: ```GET``` ```/contas?senha_banco=Cubos123Bank```

  
- ## **Adicionar conta** 
Para adicionar uma conta você deverá passar como parâmetros no body as informações da conta, nesse formato:
```
{ 
    "nome": "Foo Bar 2",
    "cpf": "00011122234",
    "data_nascimento": "2021-03-15",
    "telefone": "71999998888",
    "email": "foo@bar2.com",
     "senha": "12345"
}
```
  Através desse endereço ```POST``` ```/contas``` (Note que é o verbo usado agora o POST)
  
- ## **Modificar conta**
Para modificar os dados de uma conta você deve informar no endereço o número da conta, e o body vocé deve passar as informações que vão ser alteradas:
```
{ 
    "nome": "Foo Bar 3",
    "cpf": "00011122234",
    "data_nascimento": "2021-03-15",
    "telefone": "71999998888",
    "email": "foo@bar3.com",
     "senha": "123"
}
```
Através desse endereço ```PUT``` ```/contas/:numeroConta/usuario``` (Note que o verbo usado agora é o PUT. Substitua o ```:numeroConta``` pelo número da conta desejada)
  
- ## **Excluir conta**
Para excluir uma conta vocÊ deve apenas passar o número da conta desejada na url.
Através desse endereço ```DELETE``` ```/contas/:numeroConta``` (Note que o verbo usado agora é o DELETE)

- ## **Depositar**
Para fazer o depósito em uma conta você deve passar um parâmetro body com o número da conta e o valor do depósito, com o seguinte formato:
```
{
	"numero_conta": "1",
	"valor": 1900
}
```
Através desse endereço ```POST ``` ```/transacoes/depositar``` (Verbo utilizado POST)

- ## **Sacar**
Para realizar um saque você deve passar como parâmetros no body o número da conta, valor do depósito, e senha da conta, com o seguinte formato:
```
{
  "numero_conta": "1",
	"valor": 1900,
  "senha": "123456"
}
```
Através desse endereço: ```POST``` ```/transacoes/sacar``` (Verbo POST)
  
- ## **Transferir entre contas**
Para fazer uma transferência entre contas você deve passar como parâmetros no body o número da conta de origem, número da conta de destino, valor, e senha, com o seguinte formato:
```
{
	"numero_conta_origem": "1",
	"numero_conta_destino": "2",
  "valor": 200,
	"senha": "123456"
}
```
Através desse endereço : ```POST``` ```/transacoes/transferir``` (Verbo POST)
  
- ## **Consultar saldo**
Para consultar o saldo de uma conta você deve passar parâmetros do tipo query na url, com o seguinte formato:
```GET``` ```/contas/saldo?numero_conta=123&senha=123``` (Altere apenas os números, tanto da conta, como a senha)
  
- ## **Consultar extrato**
Para consultar o extrato de uma conta vocé deve passar parâmetros do tipo query na url, com o seguinte formato:
```GET``` ```/contas/saldo?numero_conta=123&senha=123``` (Altere apenas os números, tanto da conta, como a senha)

