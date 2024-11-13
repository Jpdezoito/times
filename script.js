function carregarJogadores() {
  let jogadoresSalvos = localStorage.getItem("jogadores");
  return jogadoresSalvos ? JSON.parse(jogadoresSalvos) : [];
}

function carregarTimes() {
  let timesSalvos = localStorage.getItem("times");
  return timesSalvos ? JSON.parse(timesSalvos) : { amarelo: [], azul: [], ausentes: [] };
}

function salvarTimes() {
  localStorage.setItem("times", JSON.stringify(times));
}

function salvarJogadores() {
  localStorage.setItem("jogadores", JSON.stringify(jogadores));
}

let jogadores = carregarJogadores();
let times = carregarTimes();

function marcarPresenca() {
  let nome = document.getElementById("nome-presenca").value;
  let status = document.getElementById("status-presenca").value;
  let select = document.getElementById("nome-presenca");

  // Remove o jogador de ambos os times e da lista de ausentes
  times.amarelo = times.amarelo.filter(jogador => jogador !== nome);
  times.azul = times.azul.filter(jogador => jogador !== nome);
  times.ausentes = times.ausentes.filter(jogador => jogador !== nome);

  if (status === "presente") {
    let timeDoJogador = times.amarelo.length <= times.azul.length ? "amarelo" : "azul";
    times[timeDoJogador].push(nome);
  } else {
    times.ausentes.push(nome);
  }

  salvarTimes();
  atualizarListaJogadores();

  // Atualiza a lista de jogadores no localStorage
  jogadores = jogadores.filter(jogador => times.amarelo.includes(jogador.nome) || times.azul.includes(jogador.nome) || times.ausentes.includes(jogador.nome));
  salvarJogadores();

  // Desabilita a opção do jogador no dropdown
  for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].value === nome) {
      select.options[i].disabled = true;
      break;
    }
  }
}

function separarJogadores() {
  let hoje = new Date();
  if (hoje.getDay() === 0) {
    let primeiroDomingo = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    let ultimoDomingo = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    ultimoDomingo.setDate(ultimoDomingo.getDate() - ultimoDomingo.getDay());

    if (hoje.getDate() === primeiroDomingo.getDate()) {
      // Embaralha a lista de jogadores
      for (let i = jogadores.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [jogadores[i], jogadores[j]] = [jogadores[j], jogadores[i]];
      }

      // Reinicia os times
      times = { amarelo: [], azul: [], ausentes: [] };

      // Distribui os jogadores nos times
      for (let i = 0; i < jogadores.length; i++) {
        if (i % 2 === 0) {
          times.amarelo.push(jogadores[i].nome);
        } else {
          times.azul.push(jogadores[i].nome);
        }
      }

      salvarTimes();
      atualizarListaJogadores();
    }
  }
}

function atualizarListaJogadores() {
  document.getElementById("lista-amarelo").innerHTML = "";
  document.getElementById("lista-azul").innerHTML = "";
  document.getElementById("lista-ausentes").innerHTML = "";

  if (!Array.isArray(times.ausentes)) {
    times.ausentes = [];
  }

  for (let jogador of times.amarelo) {
    let li = document.createElement("li");
    li.textContent = jogador;
    document.getElementById("lista-amarelo").appendChild(li);
  }

  for (let jogador of times.azul) {
    let li = document.createElement("li");
    li.textContent = jogador;
    document.getElementById("lista-azul").appendChild(li);
  }

  for (let jogador of times.ausentes) {
    let li = document.createElement("li");
    li.textContent = jogador;
    document.getElementById("lista-ausentes").appendChild(li);
  }

  atualizarSelectsJogadores();
}

function atualizarSelectsJogadores() {
  atualizarSelectPresenca();
  atualizarSelectRemover();
}

function atualizarSelectPresenca() {
  let select = document.getElementById("nome-presenca");
  select.innerHTML = "";
  for (let jogador of jogadores) {
    let option = document.createElement("option");
    option.value = jogador.nome;
    option.textContent = jogador.nome;

    // Verifica o status atual do jogador
    let statusAtual = 
        times.amarelo.includes(jogador.nome) ? 'presente' : 
        times.azul.includes(jogador.nome) ? 'presente' : 
        times.ausentes.includes(jogador.nome) ? 'ausente' : null;

    // Desabilita a opção se ela corresponder ao status atual do jogador e ao status selecionado
    if (statusAtual === 'presente' && document.getElementById('status-presenca').value === 'presente') {
      option.disabled = true;
    } else if (statusAtual === 'ausente' && document.getElementById('status-presenca').value === 'ausente') {
      option.disabled = true;
    }

    select.appendChild(option);
  }
}

function atualizarSelectRemover() {
  let select = document.getElementById("nome-remover");
  select.innerHTML = "";
  for (let jogador of jogadores) {
    let option = document.createElement("option");
    option.value = jogador.nome;
    option.textContent = jogador.nome;
    select.appendChild(option);
  }
}

function removerJogador() {
  let select = document.getElementById("nome-remover");
  let nome = select.value;
  jogadores = jogadores.filter(jogador => jogador.nome !== nome);
  salvarJogadores();

  times.amarelo = times.amarelo.filter(jogador => jogador !== nome);
  times.azul = times.azul.filter(jogador => jogador !== nome);
  times.ausentes = times.ausentes.filter(jogador => jogador !== nome);
  salvarTimes();

  atualizarListaJogadores();
}

function sair() {
  localStorage.removeItem('jogadorLogado');
  window.location.href = 'login.html';
}

// Inicializar a lista de jogadores ao carregar a página
atualizarListaJogadores();