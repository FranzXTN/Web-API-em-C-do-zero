// URL principal da API (porta do perfil "http" do launchSettings.json).
// Se a API rodar pelo perfil "https", troque por https://localhost:7278/api/Materiais
const API_URL = "http://localhost:5210/api/Materiais";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

let materiais = [];

// ---------- Seleção dos elementos ----------
const areaMensagens = document.querySelector("#mensagens");
const listaMateriais = document.querySelector("#lista-materiais");
const btnRecarregar = document.querySelector("#btn-recarregar");

const resumoTotal = document.querySelector("#resumo-total");
const resumoLivros = document.querySelector("#resumo-livros");
const resumoRevistas = document.querySelector("#resumo-revistas");

const formConsulta = document.querySelector("#form-consulta");
const consultaId = document.querySelector("#consulta-id");

const formLivro = document.querySelector("#form-livro");
const livroTitulo = document.querySelector("#livro-titulo");
const livroAno = document.querySelector("#livro-ano");
const livroAutor = document.querySelector("#livro-autor");
const livroPaginas = document.querySelector("#livro-paginas");

const formRevista = document.querySelector("#form-revista");
const revistaTitulo = document.querySelector("#revista-titulo");
const revistaAno = document.querySelector("#revista-ano");
const revistaEdicao = document.querySelector("#revista-edicao");
const revistaMes = document.querySelector("#revista-mes");

const formEdicao = document.querySelector("#form-edicao");
const edicaoId = document.querySelector("#edicao-id");
const edicaoTipo = document.querySelector("#edicao-tipo");
const edicaoTitulo = document.querySelector("#edicao-titulo");
const edicaoAno = document.querySelector("#edicao-ano");
const edicaoCamposLivro = document.querySelector("#edicao-campos-livro");
const edicaoAutor = document.querySelector("#edicao-autor");
const edicaoPaginas = document.querySelector("#edicao-paginas");
const edicaoCamposRevista = document.querySelector("#edicao-campos-revista");
const edicaoEdicao = document.querySelector("#edicao-edicao");
const edicaoMes = document.querySelector("#edicao-mes");

const modalInfoTitulo = document.querySelector("#modal-info-titulo");
const modalInfoCorpo = document.querySelector("#modal-info-corpo");
const modalInfo = new bootstrap.Modal(document.querySelector("#modal-info"));
const modalEdicao = new bootstrap.Modal(document.querySelector("#modal-edicao"));

// ---------- Mensagens ----------
function mostrarMensagem(texto, tipo) {
  const alerta = document.createElement("div");
  alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
  alerta.setAttribute("role", tipo === "danger" ? "alert" : "status");
  alerta.textContent = texto;

  const botaoFechar = document.createElement("button");
  botaoFechar.type = "button";
  botaoFechar.className = "btn-close";
  botaoFechar.setAttribute("data-bs-dismiss", "alert");
  botaoFechar.setAttribute("aria-label", "Fechar mensagem");
  alerta.append(botaoFechar);

  areaMensagens.prepend(alerta);


  setTimeout(function () {
    alerta.remove();
  }, 8000);
}

// ---------- Requisições ----------
// Lê a mensagem de erro que a API devolveu (ela manda texto simples ou JSON).
function lerErro(resposta) {
  return resposta.text().then(function (texto) {
    try {
      const json = JSON.parse(texto);
      if (typeof json === "string") return json;
      if (json.errors) return Object.values(json.errors).flat().join(" ");
      if (json.title) return json.title;
    } catch (erro) {
      // não era JSON, usa o texto puro
    }
    return texto || `Erro ${resposta.status}`;
  });
}

function requisitar(url, opcoes) {
  return fetch(url, opcoes)
    .catch(function () {
      throw new Error("Não foi possível conectar à API. Confira se ela está rodando e se a API_URL está correta.");
    })
    .then(function (resposta) {
      if (!resposta.ok) {
        return lerErro(resposta).then(function (mensagem) {
          throw new Error(mensagem);
        });
      }
      return resposta;
    });
}

function enviarJson(url, metodo, dados) {
  return requisitar(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
}

// ---------- Validação ----------
function marcarCampo(campo, valido, mensagem) {
  const feedback = campo.parentElement.querySelector(".invalid-feedback");
  campo.classList.toggle("is-invalid", !valido);
  if (feedback) feedback.textContent = valido ? "" : mensagem;
  return valido;
}

function validarTitulo(campo) {
  return marcarCampo(campo, campo.value.trim() !== "", "Informe o título.");
}

function validarAno(campo) {
  const ano = Number(campo.value);
  const anoAtual = new Date().getFullYear();
  const valido = campo.value !== "" && Number.isInteger(ano) && ano >= 0 && ano <= anoAtual;
  return marcarCampo(campo, valido, `Informe um ano entre 0 e ${anoAtual}.`);
}

function validarAutor(campo) {
  return marcarCampo(campo, campo.value.trim() !== "", "Informe o autor.");
}

function validarPaginas(campo) {
  const paginas = Number(campo.value);
  const valido = campo.value !== "" && Number.isInteger(paginas) && paginas > 0;
  return marcarCampo(campo, valido, "O número de páginas deve ser maior que 0.");
}

function validarEdicao(campo) {
  const edicao = Number(campo.value);
  const valido = campo.value !== "" && Number.isInteger(edicao) && edicao > 0;
  return marcarCampo(campo, valido, "A edição deve ser maior que 0.");
}

function validarMes(campo) {
  const mes = Number(campo.value);
  const valido = campo.value !== "" && mes >= 1 && mes <= 12;
  return marcarCampo(campo, valido, "Selecione o mês de publicação.");
}

function validarId(campo) {
  const id = Number(campo.value);
  const valido = campo.value !== "" && Number.isInteger(id) && id > 0;
  return marcarCampo(campo, valido, "Informe um ID maior que 0.");
}

// Roda todas as validações (sem parar na primeira) e diz se tudo está ok
function todosValidos(resultados) {
  return resultados.every(function (r) {
    return r;
  });
}

function limparValidacao(formulario) {
  formulario.querySelectorAll(".is-invalid").forEach(function (campo) {
    campo.classList.remove("is-invalid");
  });
}

// ---------- Resumo ----------
function atualizarResumo() {
  const livros = materiais.filter(function (m) {
    return m.tipo === "Livro";
  }).length;
  const revistas = materiais.filter(function (m) {
    return m.tipo === "Revista";
  }).length;

  resumoTotal.textContent = materiais.length;
  resumoLivros.textContent = livros;
  resumoRevistas.textContent = revistas;
}

// ---------- Listagem (GET) ----------
// A lista devolvida pela API pode vir só com os campos comuns (id, título, ano, tipo).
// Quando faltar autor/páginas ou edição/mês, buscamos o material completo pelo ID.
function precisaDetalhes(material) {
  if (material.tipo === "Livro") return material.autor === undefined;
  if (material.tipo === "Revista") return material.edicao === undefined;
  return false;
}

function completarDetalhes(lista) {
  return Promise.all(
    lista.map(function (material) {
      if (!precisaDetalhes(material)) return material;
      return requisitar(`${API_URL}/${material.id}`).then(function (resposta) {
        return resposta.json();
      });
    })
  );
}

function carregarMateriais() {
  listaMateriais.textContent = "";
  const carregando = document.createElement("p");
  carregando.className = "text-secondary";
  carregando.textContent = "Carregando materiais...";
  listaMateriais.append(carregando);

  return requisitar(API_URL)
    .then(function (resposta) {
      return resposta.json();
    })
    .then(completarDetalhes)
    .then(function (lista) {
      materiais = lista;
      renderizarMateriais();
      atualizarResumo();
    })
    .catch(function (erro) {
      materiais = [];
      atualizarResumo();
      listaMateriais.textContent = "";
      const aviso = document.createElement("div");
      aviso.className = "alert alert-danger";
      aviso.setAttribute("role", "alert");
      aviso.textContent = `Erro ao carregar os materiais: ${erro.message}`;
      listaMateriais.append(aviso);
    });
}

function criarBotao(texto, classe, rotuloAcessivel, acao) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = `btn btn-sm ${classe}`;
  botao.textContent = texto;
  botao.setAttribute("aria-label", rotuloAcessivel);
  botao.addEventListener("click", acao);
  return botao;
}

function criarLinhaTexto(rotulo, valor) {
  const linha = document.createElement("p");
  linha.className = "card-text mb-1";
  const negrito = document.createElement("strong");
  negrito.textContent = `${rotulo}: `;
  linha.append(negrito, document.createTextNode(String(valor)));
  return linha;
}

function nomeDoMes(numero) {
  return MESES[numero - 1] || numero;
}

function criarCard(material) {
  const coluna = document.createElement("div");
  coluna.className = "col-12 col-md-6";

  const card = document.createElement("article");
  card.className = "card card-material h-100 shadow-sm";

  const corpo = document.createElement("div");
  corpo.className = "card-body d-flex flex-column";

  const selo = document.createElement("span");
  selo.className = `badge align-self-start mb-2 ${material.tipo === "Livro" ? "text-bg-success" : "text-bg-warning"}`;
  selo.textContent = material.tipo;

  const titulo = document.createElement("h3");
  titulo.className = "card-title h5";
  titulo.textContent = material.titulo;

  corpo.append(selo, titulo);
  corpo.append(criarLinhaTexto("ID", material.id));
  corpo.append(criarLinhaTexto("Ano de publicação", material.anoPublicacao));

  if (material.tipo === "Livro") {
    corpo.append(criarLinhaTexto("Autor", material.autor));
    corpo.append(criarLinhaTexto("Páginas", material.paginas));
  } else if (material.tipo === "Revista") {
    corpo.append(criarLinhaTexto("Edição", material.edicao));
    corpo.append(criarLinhaTexto("Mês de publicação", nomeDoMes(material.mesPublicacao)));
  }

  const acoes = document.createElement("div");
  acoes.className = "acoes-material d-flex flex-wrap gap-2 mt-auto pt-3";

  const nome = material.titulo;
  acoes.append(
    criarBotao("Consultar", "btn-outline-primary", `Consultar ${nome}`, function () {
      consultarMaterial(material.id);
    }),
    criarBotao("Descrição e prazo", "btn-outline-secondary", `Ver descrição e prazo de ${nome}`, function () {
      mostrarDescricao(material.id);
    }),
    criarBotao("Emprestar", "btn-outline-success", `Emprestar ${nome}`, function () {
      emprestarMaterial(material.id);
    }),
    criarBotao("Editar", "btn-outline-warning", `Editar ${nome}`, function () {
      abrirEdicao(material.id);
    }),
    criarBotao("Excluir", "btn-outline-danger", `Excluir ${nome}`, function () {
      excluirMaterial(material.id, material.titulo);
    })
  );

  corpo.append(acoes);
  card.append(corpo);
  coluna.append(card);
  return coluna;
}

function renderizarMateriais() {
  listaMateriais.textContent = "";

  if (materiais.length === 0) {
    const vazio = document.createElement("div");
    vazio.className = "col-12";
    const aviso = document.createElement("div");
    aviso.className = "alert alert-info mb-0";
    aviso.textContent = "Nenhum material cadastrado ainda. Use o formulário para cadastrar o primeiro.";
    vazio.append(aviso);
    listaMateriais.append(vazio);
    return;
  }

  materiais.forEach(function (material) {
    listaMateriais.append(criarCard(material));
  });
}

// ---------- Modal de informações ----------
function abrirInfo(titulo, linhas) {
  modalInfoTitulo.textContent = titulo;
  modalInfoCorpo.textContent = "";

  linhas.forEach(function (linha) {
    const dt = document.createElement("dt");
    dt.className = "col-sm-5";
    dt.textContent = linha[0];

    const dd = document.createElement("dd");
    dd.className = "col-sm-7";
    dd.textContent = linha[1];

    modalInfoCorpo.append(dt, dd);
  });

  modalInfo.show();
}

// ---------- Consulta por ID (GET /{id}) ----------
function consultarMaterial(id) {
  return requisitar(`${API_URL}/${id}`)
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (material) {
      const linhas = [
        ["ID", material.id],
        ["Tipo", material.tipo],
        ["Título", material.titulo],
        ["Ano de publicação", material.anoPublicacao],
      ];
      if (material.tipo === "Livro") {
        linhas.push(["Autor", material.autor], ["Páginas", material.paginas]);
      } else if (material.tipo === "Revista") {
        linhas.push(["Edição", material.edicao], ["Mês de publicação", nomeDoMes(material.mesPublicacao)]);
      }
      abrirInfo("Detalhes do material", linhas);
    })
    .catch(function (erro) {
      mostrarMensagem(`Não foi possível consultar o material ${id}: ${erro.message}`, "danger");
    });
}

formConsulta.addEventListener("submit", function (evento) {
  evento.preventDefault();
  if (!validarId(consultaId)) return;
  consultarMaterial(Number(consultaId.value));
});

// ---------- Descrição e prazo (GET /{id}/descricao) ----------
function mostrarDescricao(id) {
  return requisitar(`${API_URL}/${id}/descricao`)
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (dados) {
      abrirInfo("Descrição e prazo de empréstimo", [
        ["ID", dados.id],
        ["Tipo", dados.tipo],
        ["Descrição", dados.descricao],
        ["Prazo de empréstimo", `${dados.prazoEmprestimo} dias`],
      ]);
    })
    .catch(function (erro) {
      mostrarMensagem(`Não foi possível obter a descrição do material ${id}: ${erro.message}`, "danger");
    });
}

// ---------- Empréstimo (POST /{id}/emprestar) ----------
function emprestarMaterial(id) {
  return requisitar(`${API_URL}/${id}/emprestar`, { method: "POST" })
    .then(function (resposta) {
      return resposta.text();
    })
    .then(function (texto) {
      mostrarMensagem(texto, "success");
    })
    .catch(function (erro) {
      // Revista cai aqui (400) e material inexistente também (404)
      mostrarMensagem(erro.message, "danger");
    });
}

// ---------- Cadastro (POST) ----------
function cadastrarLivro(evento) {
  evento.preventDefault();

  const valido = todosValidos([
    validarTitulo(livroTitulo),
    validarAno(livroAno),
    validarAutor(livroAutor),
    validarPaginas(livroPaginas),
  ]);
  if (!valido) {
    mostrarMensagem("Corrija os campos destacados antes de cadastrar o livro.", "danger");
    return;
  }

  const livro = {
    titulo: livroTitulo.value.trim(),
    anoPublicacao: Number(livroAno.value),
    autor: livroAutor.value.trim(),
    paginas: Number(livroPaginas.value),
  };

  enviarJson(`${API_URL}/livro`, "POST", livro)
    .then(function () {
      mostrarMensagem(`Livro "${livro.titulo}" cadastrado com sucesso.`, "success");
      formLivro.reset();
      limparValidacao(formLivro);
      return carregarMateriais();
    })
    .catch(function (erro) {
      mostrarMensagem(`Erro ao cadastrar o livro: ${erro.message}`, "danger");
    });
}

function cadastrarRevista(evento) {
  evento.preventDefault();

  const valido = todosValidos([
    validarTitulo(revistaTitulo),
    validarAno(revistaAno),
    validarEdicao(revistaEdicao),
    validarMes(revistaMes),
  ]);
  if (!valido) {
    mostrarMensagem("Corrija os campos destacados antes de cadastrar a revista.", "danger");
    return;
  }

  const revista = {
    titulo: revistaTitulo.value.trim(),
    anoPublicacao: Number(revistaAno.value),
    edicao: Number(revistaEdicao.value),
    mesPublicacao: Number(revistaMes.value),
  };

  enviarJson(`${API_URL}/revista`, "POST", revista)
    .then(function () {
      mostrarMensagem(`Revista "${revista.titulo}" cadastrada com sucesso.`, "success");
      formRevista.reset();
      limparValidacao(formRevista);
      return carregarMateriais();
    })
    .catch(function (erro) {
      mostrarMensagem(`Erro ao cadastrar a revista: ${erro.message}`, "danger");
    });
}

formLivro.addEventListener("submit", cadastrarLivro);
formRevista.addEventListener("submit", cadastrarRevista);

// ---------- Edição (GET para preencher + PUT para salvar) ----------
function abrirEdicao(id) {
  return requisitar(`${API_URL}/${id}`)
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (material) {
      limparValidacao(formEdicao);

      edicaoId.value = material.id;
      edicaoTipo.value = material.tipo;
      edicaoTitulo.value = material.titulo;
      edicaoAno.value = material.anoPublicacao;

      const ehLivro = material.tipo === "Livro";
      edicaoCamposLivro.classList.toggle("d-none", !ehLivro);
      edicaoCamposRevista.classList.toggle("d-none", ehLivro);

      if (ehLivro) {
        edicaoAutor.value = material.autor;
        edicaoPaginas.value = material.paginas;
      } else {
        edicaoEdicao.value = material.edicao;
        edicaoMes.value = material.mesPublicacao;
      }

      modalEdicao.show();
    })
    .catch(function (erro) {
      mostrarMensagem(`Não foi possível carregar o material ${id} para edição: ${erro.message}`, "danger");
    });
}

function salvarEdicao(evento) {
  evento.preventDefault();

  const id = Number(edicaoId.value);
  const ehLivro = edicaoTipo.value === "Livro";

  const resultados = [validarTitulo(edicaoTitulo), validarAno(edicaoAno)];
  if (ehLivro) {
    resultados.push(validarAutor(edicaoAutor), validarPaginas(edicaoPaginas));
  } else {
    resultados.push(validarEdicao(edicaoEdicao), validarMes(edicaoMes));
  }
  if (!todosValidos(resultados)) return;

  let url;
  let dados;
  if (ehLivro) {
    url = `${API_URL}/livro/${id}`;
    dados = {
      titulo: edicaoTitulo.value.trim(),
      anoPublicacao: Number(edicaoAno.value),
      autor: edicaoAutor.value.trim(),
      paginas: Number(edicaoPaginas.value),
    };
  } else {
    url = `${API_URL}/revista/${id}`;
    dados = {
      titulo: edicaoTitulo.value.trim(),
      anoPublicacao: Number(edicaoAno.value),
      edicao: Number(edicaoEdicao.value),
      mesPublicacao: Number(edicaoMes.value),
    };
  }

  enviarJson(url, "PUT", dados)
    .then(function () {
      modalEdicao.hide();
      mostrarMensagem(`Material ${id} atualizado com sucesso.`, "success");
      return carregarMateriais();
    })
    .catch(function (erro) {
      mostrarMensagem(`Erro ao atualizar o material ${id}: ${erro.message}`, "danger");
    });
}

formEdicao.addEventListener("submit", salvarEdicao);

// ---------- Exclusão (DELETE) ----------
function excluirMaterial(id, titulo) {
  if (!window.confirm(`Deseja realmente excluir "${titulo}"?`)) return;

  requisitar(`${API_URL}/${id}`, { method: "DELETE" })
    .then(function () {
      mostrarMensagem(`Material "${titulo}" excluído com sucesso.`, "success");
      return carregarMateriais();
    })
    .catch(function (erro) {
      // Se o material já não existe, a API responde 404 e a lista é atualizada mesmo assim
      mostrarMensagem(`Erro ao excluir o material: ${erro.message}`, "danger");
      return carregarMateriais();
    });
}

// ---------- Início ----------
function preencherMeses(select) {
  MESES.forEach(function (nome, indice) {
    const opcao = document.createElement("option");
    opcao.value = indice + 1;
    opcao.textContent = nome;
    select.append(opcao);
  });
}

preencherMeses(revistaMes);
preencherMeses(edicaoMes);

btnRecarregar.addEventListener("click", carregarMateriais);

carregarMateriais();
