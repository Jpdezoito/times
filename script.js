let times = { amarelo: [], azul: [], ausentes: [] };
let jogadores = [];

// Função para buscar os jogadores na API
function buscarJogadores() {
  fetch('http://localhost:3000/jogadores')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar jogadores');
      }
      return response.json();
    })
    .then(data => {
      jogadores = data;
      atualizarListaJogadores();
    })
    .catch(error => {
      console.error(error);
      alert('Erro ao buscar jogadores');
    });
}

// Chama a função buscarJogadores ao carregar a página
buscarJogadores();

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

  // Atualiza a lista de jogadores após marcar a presença
  atualizarListaJogadores();

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

      // Faz a requisição para a API para atualizar os times
      fetch('http://localhost:3000/times', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(times)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao atualizar times');
          }
          return response.json();
        })
        .then(data => {
          // Atualiza a lista de jogadores após a requisição
          atualizarListaJogadores();
        })
        .catch(error => {
          console.error(error);
          alert('Erro ao atualizar times');
        });
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

  for (let jogador of jogadores) {
    let li = document.createElement("li");
    li.textContent = jogador.nome;

    if (times.amarelo.includes(jogador.nome)) {
      document.getElementById("lista-amarelo").appendChild(li);
    } else if (times.azul.includes(jogador.nome)) {
      document.getElementById("lista-azul").appendChild(li);
    } else if (times.ausentes.includes(jogador.nome)) {
      document.getElementById("lista-ausentes").appendChild(li);
    }
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

    // Verifica o status atual do jogador (requisição para a API)
    fetch(`http://localhost:3000/jogadores/${jogador.apelido}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao buscar jogador');
        }
        return response.json();
      })
      .then(jogador => {
        let statusAtual =
          times.amarelo.includes(jogador.nome) ?
            'presente' :
            times.azul.includes(jogador.nome) ?
              'presente' :
              times.ausentes.includes(jogador.nome) ? 'ausente' : null;

        // Desabilita a opção se ela corresponder ao status atual do jogador e ao status selecionado
        if (statusAtual === 'presente' && document.getElementById('status-presenca').value === 'presente') {
          option.disabled = true;
        } else if (statusAtual === 'ausente' && document.getElementById('status-presenca').value === 'ausente') {
          option.disabled = true;
        }
      })
      .catch(error => {
        console.error(error);
        alert('Erro ao buscar jogador');
      });

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

  // Faz a requisição para a API para remover o jogador
  fetch(`http://localhost:3000/jogadores/${nome}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao remover jogador');
      }
      return response.json();
    })
    .then(data => {
      // Atualiza a lista de jogadores após a requisição
      atualizarListaJogadores();
    })
    .catch(error => {
      console.error(error);
      alert('Erro ao remover jogador');
    });
}

function sair() {
  window.location.href = 'login.html';
}

// Inicializar a lista de jogadores ao carregar a página
atualizarListaJogadores();