const express = require('express') //inicia o express
const router = express.Router() // configura a 1 parte da rota
const cors = require ("cors")// permite consumir essa API no Front-End

const conectaBancodeDados = require('./bancoDeDados') //ligando ao arquivo banco de dados
conectaBancodeDados() //chamndo a função que conecta o banco de dados

const Mulher = require('./mulherModel')

const app = express() // inicia o app
app.use(express.json())// permite que os dados sejam enviado no formato json
app.use(cors()) // libera as requisições entre diferentes origens

const porta = 3333 // cria a porta


//get
async function mostraMulheres(request, response) {
    try {
        const mulheresVindasDoBancoDeDados = await Mulher.find()

        response.json(mulheresVindasDoBancoDeDados)
    } catch (erro){
        console.log(erro)
    }
    
}

//post
async function criaMulher(request, response) {
    const novaMulher = new Mulher({
        nome: request.body.nome,
        imagem: request.body.imagem,
        citacao: request.body.citacao,
        minibio: request.body.minibio
    })

    try {
        const mulherCriada = await novaMulher.save()
        response.status(201).json(mulherCriada)
    } catch (erro) {
        console.log(erro)
    }

}

//patch
async function corrigeMulher(request, response) {
    try {
        const mulherEncontrada = await Mulher.findById(request.params.id)

        if (request.body.nome) {
            mulherEncontrada.nome = request.body.nome
        }
        if (request.body.imagem) {
            mulherEncontrada = request.body.imagem
        } 
        if (request.body.citacao) {
            mulherEncontrada = request.body.citacao
        }
        if (request.body.minibio) {
            mulherEncontrada.minibio = request.body.minibio
        }
        
        const mulherAtualizadaNoBancoDeDados = await mulherEncontrada.save()

        response.json(mulherAtualizadaNoBancoDeDados)
    }catch (erro) {
        console.log(erro)
    }
}

//delete
async function deletaMulher (request, response) {
    try {
        await Mulher.findByIdAndDelete(request.params.id)
        response.json({mensagem:'Mulher deletada com sucesso!'})
    }catch (erro) {
        console.log(erro)
    }
}


//configurar rotas
app.use(router.get('/mulheres', mostraMulheres))
app.use(router.post('/mulheres', criaMulher))
app.use(router.patch('/mulheres/:id', corrigeMulher))
app.use(router.delete('/mulheres/:id',deletaMulher))

//porta
function mostraPorta() {
    console.log('Servidor criado e rodando na porta ', porta)
}
app.listen(porta, mostraPorta) //servidor ouvindo a porta