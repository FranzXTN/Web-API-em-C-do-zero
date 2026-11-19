# Front-end da Biblioteca Universitária

Trabalho final de Desenvolvimento Web e Mobile I.

**Integrantes:**
- Franz Trefzger Neto - 114.022
- Guilherme de Lima Soares - 114.026
- Caio Fabio de Oliveira Tlaes - 114.052
- Matheus de Almeida - 114.084

## O que foi desenvolvido

Uma página web que consome a Web API de biblioteca que fizemos em POO. Dá para ver os livros e revistas cadastrados, cadastrar novos, editar, excluir, consultar um material pelo ID, ver a descrição com o prazo de empréstimo e tentar emprestar.

## Como executar

**API:** na pasta principal do repositório:

```bash
dotnet restore
dotnet run
```

O terminal mostra a porta. O Swagger fica em `http://localhost:5210/swagger`.

**Front-end:** abrir a pasta `front` no VS Code e abrir o `index.html` com o Live Server. A API precisa estar rodando antes.

## URL da API utilizada

`http://localhost:5210/api/Materiais` (porta do perfil `http` do `launchSettings.json`). Fica na constante `API_URL` no começo do `script.js`. Se rodar pelo perfil `https`, trocar para `https://localhost:7278/api/Materiais`.

## Endpoints consumidos

| Ação | Método | Endpoint |
|---|---|---|
| Listar | GET | `/api/Materiais` |
| Consultar por ID | GET | `/api/Materiais/{id}` |
| Cadastrar livro | POST | `/api/Materiais/livro` |
| Cadastrar revista | POST | `/api/Materiais/revista` |
| Editar livro | PUT | `/api/Materiais/livro/{id}` |
| Editar revista | PUT | `/api/Materiais/revista/{id}` |
| Excluir | DELETE | `/api/Materiais/{id}` |
| Descrição e prazo | GET | `/api/Materiais/{id}/descricao` |
| Emprestar | POST | `/api/Materiais/{id}/emprestar` |

## Como o front-end foi organizado

- `index.html`: estrutura da página (cabeçalho, resumo, lista, formulários e dois modais).
- `style.css`: só pequenos ajustes por cima do Bootstrap.
- `script.js`: toda a lógica, separada em funções: `carregarMateriais`, `renderizarMateriais`, `cadastrarLivro`, `cadastrarRevista`, `abrirEdicao`, `salvarEdicao`, `excluirMaterial`, `mostrarDescricao`, `emprestarMaterial`, `mostrarMensagem` e as funções de validação. A função `requisitar` faz o `fetch` e confere o `response.ok` em um lugar só.

Os textos vindos da API são colocados na tela com `textContent` (não usamos `innerHTML`).

## Componentes do Bootstrap utilizados

Grid (`row`/`col`), cards, badges, botões, alertas dispensáveis, nav pills (abas Livro/Revista), modais, formulários com `form-control`, `form-select` e `invalid-feedback`, utilitários de espaçamento e flex.

## Validações implementadas

- Título e autor não podem ficar vazios.
- Ano: número inteiro entre 0 e o ano atual.
- Páginas e edição: inteiros maiores que 0.
- Mês da revista: precisa selecionar um mês (1 a 12).
- ID da consulta: inteiro maior que 0.
- Confirmação antes de excluir.

A API também valida tudo de novo, e quando ela devolve erro a mensagem aparece na tela.

## Testes realizados

| O que testar | Resultado |
|---|---|
| Listar materiais ao abrir a página | OK |
| Lista vazia (excluir todos) | OK, aparece a mensagem de que não há materiais |
| Cadastrar livro válido | OK |
| Cadastrar livro com campos vazios (deve mostrar erro) | OK, campos ficam vermelhos com a mensagem |
| Cadastrar revista válida | OK |
| Editar um livro | OK, o formulário abre preenchido e a lista recarrega |
| Editar uma revista | OK |
| Excluir com confirmação | OK |
| Consultar por ID existente e inexistente | OK, o inexistente mostra mensagem de erro |
| Descrição e prazo (livro 14 dias, revista 7 dias) | OK |
| Emprestar livro (sucesso) | OK, mensagem verde |
| Emprestar revista (erro) | OK, mensagem vermelha |
| API desligada (mensagem de erro de conexão) | ok|
| Tela pequena (celular) no DevTools | ok|

## Dificuldades encontradas e como resolvemos

- **A lista do GET vinha sem autor, páginas, edição e mês.** Só vinham id, título, ano e tipo. Percebemos olhando a resposta na aba Network. Resolvemos fazendo o front buscar cada material pelo `GET /api/Materiais/{id}` quando faltam esses campos, sem mexer nas regras da API.
- **Erros da API vêm como texto simples, não como JSON.** Quando a API devolve 400 ou 404 o corpo é só uma frase. Criamos a função `lerErro`, que lê o texto (e também trata JSON, se vier) para mostrar a mensagem certa ao usuário.
- **O DELETE responde 204 sem corpo.** Se tentássemos usar `resposta.json()` dava erro, então no DELETE só conferimos o `response.ok`.
- **Empréstimo de revista devolve erro.** Isso é regra da API, então no front tratamos como mensagem vermelha, e o livro como mensagem verde.
- **Editar livro e revista usam endpoints diferentes.** O formulário de edição mostra os campos conforme o tipo e escolhe `/livro/{id}` ou `/revista/{id}`.
- **Porta da API e conexão.** A porta é a do `launchSettings.json` (5210 em http). Se a API estiver desligada, o `fetch` falha e mostramos uma mensagem explicando.

## O que cada integrante aprendeu

- **Franz:** como a API foi montada (controllers e repository) e como o front consome cada endpoint, incluindo por que a lista vem sem os campos de livro e revista.
- **Guilherme:** usar `fetch` com `then`, conferir `response.ok` e ler o corpo da resposta de erro.
- **Caio:** montar a interface com Bootstrap (grid, cards, modais e abas) e deixar tudo responsivo.
- **Matheus:** validar os formulários no JavaScript, mostrar o erro em cada campo e usar `textContent` em vez de `innerHTML`.
