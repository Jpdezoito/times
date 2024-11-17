const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Carregar jogadores do arquivo JSON
function carregarJogadores() {
  try {
    const data = fs.readFileSync('jogadores.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return []; // Retorna um array vazio se o arquivo não existir ou houver erro
  }
}

// Salvar jogadores no arquivo JSON
function salvarJogadores(jogadores) {
  const data = JSON.stringify(jogadores);
  fs.writeFileSync('jogadores.json', data);
}

let jogadores = carregarJogadores();

// Cadastrar jogador (POST)
app.post('/jogadores', (req, res) => {
  const { nome, apelido } = req.body;

  const jogadorExistente = jogadores.find(j => j.apelido === apelido);
  if (jogadorExistente) {
    return res.status(400).json({ erro: 'Apelido já cadastrado' });
  }

  jogadores.push({ nome, apelido });
  salvarJogadores(jogadores);
  res.status(201).json({ mensagem: 'Jogador cadastrado com sucesso' });
});

// Buscar jogador por apelido (GET)
app.get('/jogadores/:apelido', (req, res) => {
  const apelido = req.params.apelido;
  const jogador = jogadores.find(j => j.apelido === apelido);

  if (jogador) {
    res.json(jogador);
  } else {
    res.status(404).json({ erro: 'Jogador não encontrado' });
  }
});

// Listar todos os jogadores (GET)
app.get('/jogadores', (req, res) => {
  res.json(jogadores);
});

// Atualizar jogador (PUT)
app.put('/jogadores/:apelido', (req, res) => {
  const apelido = req.params.apelido;
  const { nome } = req.body;
  const jogadorIndex = jogadores.findIndex(j => j.apelido === apelido);

  if (jogadorIndex === -1) {
    return res.status(404).json({ erro: 'Jogador não encontrado' });
  }

  jogadores[jogadorIndex] = { nome, apelido };
  salvarJogadores(jogadores);
  res.json({ mensagem: 'Jogador atualizado com sucesso' });
});

// Remover jogador (DELETE)
app.delete('/jogadores/:apelido', (req, res) => {
  const apelido = req.params.apelido;
  jogadores = jogadores.filter(j => j.apelido !== apelido);
  salvarJogadores(jogadores);
  res.json({ mensagem: 'Jogador removido com sucesso' });
});

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});