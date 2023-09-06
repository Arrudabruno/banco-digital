const bancoDeDados = require('../bancodedados')

const validacaoCampos = (req, res, nome, cpf, data_nascimento, telefone, email, senha) => {
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return true
    }
}
const validacaoEmailCpf = (req, res, email, cpf) => {
    const cpfDuplicado = bancoDeDados.contas.find((elemento) => {
        return elemento.usuario.cpf === cpf
    })
    const emailDuplicado = bancoDeDados.contas.find((elemento) => {
        return elemento.usuario.email === email
    })

    if (cpfDuplicado || emailDuplicado) {
        return true
    }
}

const listarContas = (req, res) => {
    const { senha_banco } = req.query
    if (!senha_banco) {
        return res.status(400).json({ mensagem: "A senha é obrigatória" })
    }
    if (senha_banco === bancoDeDados.banco.senha) {
        return res.status(200).json(bancoDeDados.contas)
    }
    if (senha_banco !== bancoDeDados.banco.senha) {
        return res.status(403).json({ mensagem: "Senha incrreta." })
    }
}

const adicionarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
    if (validacaoCampos(req, res, nome, cpf, data_nascimento, telefone, email, senha)) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." })
    }

    if (validacaoEmailCpf(req, res, email, cpf)) {
        return res.status(400).json({ mensagem: "Usuário já existente com esse email ou CPF." })
    }

    const novoUsuario = {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    }
    const novaConta = {
        numero: bancoDeDados.numeroConta,
        saldo: 0,
        usuario: novoUsuario
    }
    bancoDeDados.contas.push(novaConta)
    bancoDeDados.numeroConta++

    return res.status(201).json()
}

const modificarConta = (req, res) => {
    const { numeroConta } = req.params
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
    if (validacaoCampos(req, res, nome, cpf, data_nascimento, telefone, email, senha)) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." })
    }

    if (validacaoEmailCpf(req, res, email, cpf)) {
        return res.status(400).json({ mensagem: "Usuário já existente com esse email ou CPF." })
    }

    const contaEncontrada = bancoDeDados.contas.find((elemento) => {
        return elemento.numero === Number(numeroConta)
    })

    if (!contaEncontrada) {
        return res.status(400).json({ mensagem: "Conta não encontrada." })
    }

    const indice = bancoDeDados.contas.findIndex((elemento) => {
        return elemento === contaEncontrada
    })

    bancoDeDados.contas.splice(indice, 1)

    const novoUsuario = {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    }
    const novaConta = {
        numero: Number(numeroConta),
        saldo: contaEncontrada.saldo,
        usuario: novoUsuario
    }
    bancoDeDados.contas.push(novaConta)
    res.status(201).json()

}

const excluirConta = (req, res) => {
    const { numeroConta } = req.params
    const contaEncontrada = bancoDeDados.contas.find((elemento) => {
        return elemento.numero === Number(numeroConta)
    })

    if (!contaEncontrada) {
        return res.status(400).json({ mensagem: "Conta não encontrada." })
    }

    if (contaEncontrada.saldo > 0 || contaEncontrada.saldo < 0) {
        return res.status(400).json({ mensagem: "A conta só pode ser excluída se estiver sem saldo." })
    }

    const indice = bancoDeDados.contas.findIndex((elemento) => {
        return elemento === contaEncontrada
    })
    bancoDeDados.contas.splice(indice, 1)
    return res.status(204).json()
}

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body
    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios." })
    }
    const contaEncontrada = bancoDeDados.contas.find((elemento) => {
        return elemento.numero === Number(numero_conta)
    })

    if (!contaEncontrada) {
        return res.status(400).json({ mensagem: "Conta não encontrada." })
    }

    if (valor < 0) {
        return res.status(400).json({ mensagem: "O valor precisa ser maior do que zero." })
    }

    const indice = bancoDeDados.contas.findIndex((elemento) => {
        return elemento === contaEncontrada
    })

    bancoDeDados.contas[indice].saldo = bancoDeDados.contas[indice].saldo + valor

    const data = new Date()
    bancoDeDados.depositos.push(
        {
            data,
            "numero_conta": Number(numero_conta),
            "valor": Number(valor)
        }
    )

    res.status(204).json()
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body
    if (!numero_conta, !valor, !senha) {
        return res.status(400).json({ mensagem: "O número da conta, valor, e senha são obrigatórios." })
    }
    const contaEncontrada = bancoDeDados.contas.find((elemento) => {
        return elemento.numero === Number(numero_conta)
    })

    if (!contaEncontrada) {
        return res.status(400).json({ mensagem: "Conta não encontrada." })
    }

    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(403).json({ mensagem: "Senha incorreta." })
    }

    if (contaEncontrada.saldo < valor) {
        return res.status(400).json({ mensagem: "Saldo insuficiente." })
    }

    const indice = bancoDeDados.contas.findIndex((elemento) => {
        return elemento === contaEncontrada
    })

    bancoDeDados.contas[indice].saldo = bancoDeDados.contas[indice].saldo - valor

    const data = new Date()
    bancoDeDados.saques.push(
        {
            data,
            "numero_conta": Number(numero_conta),
            "valor": Number(valor)
        }
    )

    res.status(203).json()
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body
    if (!numero_conta_origem, !numero_conta_destino, !valor, !senha) {
        return res.status(400).json({ mensagem: "O número da conta de origem, número da conta de destino, valor, e senha são obrigatórios." })
    }

    const contaOrigemEncontrada = bancoDeDados.contas.find((elemento) => {
        return elemento.numero === Number(numero_conta_origem)
    })
    const contaDestinoEncontrada = bancoDeDados.contas.find((elemento) => {
        return elemento.numero === Number(numero_conta_destino)
    })
    if (!contaOrigemEncontrada || !contaDestinoEncontrada) {
        return res.status(404).json({ mensagem: "A conta de origem ou a conta de destino não foi encontrada." })
    }
    if (contaOrigemEncontrada.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: "Senha incorreta." })
    }
    if (contaOrigemEncontrada.saldo < valor) {
        return res.status(400).json({ mensagem: "Saldo insuficiente para a transferência." })
    }

    const indiceOrigem = bancoDeDados.contas.findIndex((elemento) => {
        return elemento === contaOrigemEncontrada
    })
    bancoDeDados.contas[indiceOrigem].saldo = bancoDeDados.contas[indiceOrigem].saldo - Number(valor)
    const indiceDestino = bancoDeDados.contas.findIndex((elemento) => {
        return elemento === contaDestinoEncontrada
    })
    bancoDeDados.contas[indiceDestino].saldo = bancoDeDados.contas[indiceDestino].saldo + Number(valor)

    const data = new Date()
    bancoDeDados.transferencias.push({
        "data": data,
        "numero_conta_origem": Number(numero_conta_origem),
        "numero_conta_destino": Number(numero_conta_destino),
        "valor": valor
    })

    return res.status(201).json()
}

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query
    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "O número da conta e a senha são obrigatórios." })
    }

    const contaEncontrada = bancoDeDados.contas.find((elemento) => {
        return elemento.numero === Number(numero_conta)
    })

    if (!contaEncontrada) {
        return res.status(400).json({ mensagem: "Conta não encontrada." })
    }

    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: "Senha incorreta." })
    }

    return res.status(200).json(contaEncontrada.saldo)
}

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "O número da conta e a senha são obrigaórios." })
    }

    const contaEncontrada = bancoDeDados.contas.find((elemento) => {
        return elemento.numero === Number(numero_conta)
    })

    if (!contaEncontrada) {
        return res.status(404).json({ mensagem: "Conta não encontrada" })
    }

    if (senha !== contaEncontrada.usuario.senha) {
        return res.status(403).json({ mensagem: "Senha incorreta." })
    }

    const indice = bancoDeDados.contas.findIndex((elemento) => {
        return elemento.numero === contaEncontrada
    })

    const extrato = {
        depositos: [],
        saques: [],
        transferenciasEnviadas: [],
        transferenciasRecebidas: []
    }
    for (let i of bancoDeDados.depositos) {
        if (i.numero_conta === Number(numero_conta)) {
            extrato.depositos.push(i)
        }
    }
    for (let i of bancoDeDados.saques) {
        if (i.numero_conta === Number(numero_conta)) {
            extrato.saques.push(i)
        }
    }
    for (let i of bancoDeDados.transferencias) {
        if (i.numero_conta_origem === Number(numero_conta)) {
            extrato.transferenciasEnviadas.push(i)
        }
    }
    for (let i of bancoDeDados.transferencias) {
        if (i.numero_conta_destino === Number(numero_conta)) {
            extrato.transferenciasRecebidas.push(i)
        }
    }

    res.status(200).json(extrato)
}


module.exports = {
    listarContas,
    adicionarConta,
    modificarConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
}