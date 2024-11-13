function carregarJogadores() {
  let jogadoresSalvos = localStorage.getItem("jogadores");
  return jogadoresSalvos ? JSON.parse(jogadoresSalvos) : [];
}

function carregarTimes() {
  let timesSalvos = localStorage.getItem("times");
  return timesSalvos ? JSON.parse(timesSalvos) : { amarelo: [], azul: [] };
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

  if (status === "presente") {
    let timeDoJogador = times.amarelo.includes(nome) ? "amarelo" : "azul";
    times[timeDoJogador].push(nome);
  } else {
    times.amarelo = times.amarelo.filter(jogador => jogador !== nome);
    times.azul = times.azul.filter(jogador => jogador !== nome);
  }

  salvarTimes();
  atualizarListaJogadores();
}

function separarJogadores() {
  let hoje = new Date();
  if (hoje.getDay() === 0) {
    let primeiroDomingo = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    let ultimoDomingo = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    ultimoDomingo.setDate(ultimoDomingo.getDate() - ultimoDomingo.getDay());

    if (hoje.getDate() === primeiroDomingo.getDate()) {
      for (let i = jogadores.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [jogadores[i], jogadores[j]] = [jogadores[j], jogadores[i]];
      }

      times = { amarelo: [], azul: [] };

      for (let i = 0; i < jogadores.length; i++) {
        if (i % 2 === 0) {
          times.amarelo.push(jogadores[i]);
        } else {
          times.azul.push(jogadores[i]);
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
    option.value = jogador.nome; // Define o valor da opção como o nome do jogador
    option.textContent = jogador.nome; // Exibe o nome do jogador na opção
    select.appendChild(option);
  }
}

function atualizarSelectRemover() {
  let select = document.getElementById("nome-remover");
  select.innerHTML = "";
  for (let jogador of jogadores) {
    let option = document.createElement("option");
    option.value = jogador.nome; // Define o valor da opção como o nome do jogador
    option.textContent = jogador.nome; // Exibe o nome do jogador na opção
    select.appendChild(option);
  }
}

function removerJogador() {
  let select = document.getElementById("nome-remover");
  let nome = select.value;

  // Remove o jogador da lista de jogadores
  jogadores = jogadores.filter(jogador => jogador.nome !== nome);
  salvarJogadores();

  // Remove o jogador dos times
  times.amarelo = times.amarelo.filter(jogador => jogador !== nome);
  times.azul = times.azul.filter(jogador => jogador !== nome);
  salvarTimes();

  atualizarListaJogadores();
}

function sair() {
  localStorage.removeItem('jogadorLogado');
  window.location.href = 'login.html';
}

// Inicializar a lista de jogadores ao carregar a página
atualizarListaJogadores();