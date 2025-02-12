# Projeto Arq Estoque – Versão Firebase

## Índice

- [Visão Geral](#visão-geral)
- [Arquitetura e Tecnologias Utilizadas](#arquitetura-e-tecnologias-utilizadas)
- [Modelagem dos Dados no Firestore](#modelagem-dos-dados-no-firestore)
  - [Coleção `users` (Usuários)](#coleção-users-usuários)
  - [Coleção `produtos` (Produtos)](#coleção-produtos-produtos)
  - [Coleção `items` (Itens)](#coleção-items-itens)
  - [Coleção `solicitacao` (Solicitação de Pedido)](#coleção-solicitacao-solicitação-de-pedido)
  - [Coleção `entrada_produtos` (Entrada de Produto)](#coleção-entrada_produtos-entrada-de-produto)
  - [Coleção `movimentacoes_estoque` (Movimentação de Estoque)](#coleção-movimentacoes_estoque-movimentação-de-estoque)
  - [Cadastros Complementares](#cadastros-complementares)
- [Processamento de Pedidos e Área Administrativa](#processamento-de-pedidos-e-área-administrativa)
- [Interface com Menu Superior](#interface-com-menu-superior)
- [Passo a Passo para Configurar e Iniciar o Projeto](#passo-a-passo-para-configurar-e-iniciar-o-projeto)
- [Considerações Finais](#considerações-finais)

---

## Visão Geral

O **Projeto Arq Estoque – Versão Firebase** tem como objetivo desenvolver um sistema de gerenciamento de estoque e pedidos para uma organização, utilizando os serviços do Firebase para armazenamento, autenticação e hospedagem. O sistema possibilita:

- **Gerenciamento de Estoque:**

  - Cadastro e atualização de produtos e itens.
  - Registro de entradas de produtos, com controle do tipo de entrada, local de estoque e valor unitário.
  - Manutenção do histórico de movimentações (entradas e saídas).

- **Processamento de Pedidos (Carrinho de Compras):**

  - Usuários autenticados podem criar solicitações de pedidos, com validação de estoque.
  - Geração de um identificador único para o carrinho e registro dos pedidos.
  - Exibição do número do pedido finalizado.

- **Gestão de Cadastros e Parâmetros:**

  - Cadastro e gerenciamento de estoques, produtos (com seleção de estoque padrão), setores/clientes, grupos de produtos, unidades, fornecedores e contratos.

- **Gerenciamento de Usuários:**

  - Autenticação via Firebase Authentication, diferenciando usuários comuns de administradores.
  - Apenas administradores podem acessar áreas restritas (painel de administração e pedidos gerais).

- **Interface Amigável:**
  - Uso de HTML, CSS, JavaScript e Bootstrap para criar uma interface responsiva e intuitiva, com menus, alertas, modais e spinners.

> **Observação:** A funcionalidade de emissão/impressão automática foi removida conforme solicitado.

---

## Arquitetura e Tecnologias Utilizadas

### Serviços do Firebase

- **Firestore:** Banco de dados NoSQL que armazena os dados em coleções e documentos.
- **Firebase Authentication:** Gerencia a autenticação dos usuários (login via email/senha, etc.).
- **Firebase Storage:** Armazena arquivos estáticos (como imagens dos produtos) com acesso seguro via URLs.
- **Firebase Hosting:** Hospeda o frontend (páginas HTML, CSS e JavaScript).
- **(Opcional) Cloud Functions:** Permite implementar lógica de backend serverless para validações e atualizações críticas.

### Frontend

- **HTML, CSS e JavaScript:** Estrutura e comportamento das páginas.
- **Bootstrap:** Utilizado para estilizar a interface, criar menus e componentes responsivos.
- **(Opcional) SPA:** Possibilidade de desenvolver como Single Page Application (usando React, Angular ou Vue.js) integrando diretamente com o Firebase.

---

## Modelagem dos Dados no Firestore

### Coleção `users` (Usuários)

Cada documento representa um usuário com os seguintes campos:

| Campo       | Tipo    | Descrição                                               |
| ----------- | ------- | ------------------------------------------------------- |
| `matricula` | String  | Identificação única, utilizada também para login.       |
| `nome`      | String  | Nome completo do usuário.                               |
| `setor`     | String  | Departamento ou área do usuário.                        |
| `is_admin`  | Boolean | Indica se o usuário possui privilégios administrativos. |
| `email`     | String  | Email do usuário, usado no Firebase Authentication.     |

### Coleção `produtos` (Produtos – Gerenciamento Detalhado)

Cada documento representa um produto:

| Campo                   | Tipo   | Descrição                                                |
| ----------------------- | ------ | -------------------------------------------------------- |
| `nome`                  | String | Nome do produto.                                         |
| `unidade`               | String | Unidade de medida (ex.: kg, unidade, litro).             |
| `estoque_minimo`        | Number | Quantidade mínima exigida no estoque.                    |
| `estoque_maximo`        | Number | Quantidade máxima permitida.                             |
| `grupo`                 | String | Categoria ou grupo do produto.                           |
| `rendimento_pronto_uso` | String | Informações sobre uso ou rendimento.                     |
| `estoque_atual`         | Number | Quantidade atual disponível.                             |
| `foto`                  | String | URL da imagem armazenada no Firebase Storage.            |
| `estoque_padrao`        | String | Nome do estoque padrão ao qual o produto está associado. |

### Coleção `items` (Itens – Versão Simplificada)

Utilizada para operações rápidas de controle:

| Campo        | Tipo   | Descrição                              |
| ------------ | ------ | -------------------------------------- |
| `nome`       | String | Nome do item.                          |
| `quantidade` | Number | Quantidade disponível no estoque.      |
| `foto`       | String | URL da imagem (armazenada no Storage). |

### Coleção `solicitacao` (Solicitação de Pedido)

Registra os pedidos (carrinho de compras):

| Campo          | Tipo      | Descrição                                                                                          |
| -------------- | --------- | -------------------------------------------------------------------------------------------------- |
| `user_id`      | String    | UID do usuário (referência ao documento na coleção `users`).                                       |
| `item_id`      | String    | ID do item solicitado (referência à coleção `items` ou `produtos`).                                |
| `carrinho_id`  | String    | Identificador único para agrupar os itens do mesmo pedido.                                         |
| `quantidade`   | Number    | Quantidade solicitada do item.                                                                     |
| `status`       | String    | Status (ex.: "pendente", "confirmado", "entregue", "cancelado").                                   |
| `created_at`   | Timestamp | Data e hora da criação da solicitação.                                                             |
| `setor_padrao` | String    | Setor padrão do funcionário (pode ser alterado).                                                   |
| `tipo_saida`   | String    | Tipo de saída (definido pelo admin: "saída-inventário", "saída-entrega" ou "saída transferência"). |

### Coleção `entrada_produtos` (Entrada de Produto)

Registra as entradas realizadas no estoque:

| Campo            | Tipo      | Descrição                                                 |
| ---------------- | --------- | --------------------------------------------------------- |
| `numero_pedido`  | String    | Número do pedido associado à entrada.                     |
| `tipo_entrada`   | String    | Tipo de entrada (ex.: "entrada-inventário").              |
| `local_estoque`  | String    | Local onde o produto será armazenado (pode ser alterado). |
| `valor_unitario` | Number    | Valor unitário do produto na entrada.                     |
| `fornecedor`     | String    | Nome ou identificação do fornecedor.                      |
| `quantidade`     | Number    | Quantidade de produtos que entraram no estoque.           |
| `data_entrada`   | Timestamp | Data e hora do registro da entrada.                       |

### Coleção `movimentacoes_estoque` (Movimentação de Estoque)

Registra cada movimentação para manter o histórico:

| Campo               | Tipo      | Descrição                                        |
| ------------------- | --------- | ------------------------------------------------ |
| `produto_id`        | String    | ID do produto (referência à coleção `produtos`). |
| `tipo`              | String    | Tipo de movimentação ("entrada" ou "saída").     |
| `quantidade`        | Number    | Quantidade movimentada.                          |
| `data_movimentacao` | Timestamp | Data e hora da movimentação.                     |

### Cadastros Complementares

Para gerenciamento completo, crie coleções ou subcoleções para:

- **Estoques:** Locais de armazenamento (ex.: "Depósito Central", "Loja 01").
- **Setores/Clientes:** Com campos `cod`, `nome` e `contrato`.
- **Grupo de Produtos:** Categorias para organização dos produtos.
- **Unidades:** Unidades de medida (ex.: kg, unidade, litro).
- **Fornecedor:** Com campos `nome`, `CNPJ`, `endereco` e `telefone`.
- **Contratos:** Definem condições específicas e vinculações.

---

## Processamento de Pedidos e Área Administrativa

### Processamento de Pedidos (Carrinho de Compras)

1. **Login:**
   O usuário se autentica via Firebase Authentication.
2. **Seleção de Produtos/Itens:**
   O usuário adiciona itens ao carrinho (armazenados em um array no JavaScript).
3. **Validação de Estoque:**
   Antes de finalizar o pedido, o sistema valida se há quantidade suficiente.
4. **Finalização do Pedido:**
   - Geração de um identificador único (`carrinho_id`).
   - Criação de um documento na coleção `solicitacao` com os dados do pedido.
   - Inclusão dos campos `setor_padrao` e `tipo_saida` (para definição pelo administrador, se aplicável).
5. **Confirmação:**
   O sistema exibe o número do pedido finalizado.

### Área Administrativa (Acesso Exclusivo)

- **Restrição de Acesso:**
  Apenas usuários com `is_admin` configurado como `true` (verificado na coleção `users`) podem acessar o painel administrativo.
- **Funcionalidades Administrativas:**
  - Visualizar e gerenciar todos os pedidos (aba “Pedidos Gerais”).
  - Atualizar status dos pedidos (ex.: "confirmado", "entregue", "cancelado").
  - Gerenciar cadastros (produtos, estoques, setores, etc.).
  - Selecionar o tipo de saída para cada solicitação.

---

## Interface com Menu Superior

O sistema utiliza um **menu superior** (navbar) com Bootstrap, organizado em categorias. Por exemplo:

- **Dashboard**
- **Cadastro:**
  - Produtos, Estoques, Setores/Clientes, Grupos de Produtos, Unidades, Fornecedores, Contratos.
- **Gerenciamento:**
  - Entrada de Produtos, Movimentações de Estoque, Solicitações de Pedido.
- **Usuários**
- **Administração:** (Exibido apenas para administradores)
- **Sair**

### Exemplo de Código da Navbar

```html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <a class="navbar-brand" href="dashboard.html">Arq Estoque</a>
  <button
    class="navbar-toggler"
    type="button"
    data-toggle="collapse"
    data-target="#navbarContent"
    aria-controls="navbarContent"
    aria-expanded="false"
    aria-label="Alternar navegação"
  >
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="dashboard.html">Dashboard</a>
      </li>
      <!-- Dropdown Cadastro -->
      <li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle"
          href="#"
          id="cadastroDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Cadastro
        </a>
        <div class="dropdown-menu" aria-labelledby="cadastroDropdown">
          <a class="dropdown-item" href="produtos.html">Produtos</a>
          <a class="dropdown-item" href="estoques.html">Estoques</a>
          <a class="dropdown-item" href="setores.html">Setores/Clientes</a>
          <a class="dropdown-item" href="grupos.html">Grupos de Produtos</a>
          <a class="dropdown-item" href="unidades.html">Unidades</a>
          <a class="dropdown-item" href="fornecedores.html">Fornecedores</a>
          <a class="dropdown-item" href="contratos.html">Contratos</a>
        </div>
      </li>
      <!-- Dropdown Gerenciamento -->
      <li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle"
          href="#"
          id="gerenciamentoDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Gerenciamento
        </a>
        <div class="dropdown-menu" aria-labelledby="gerenciamentoDropdown">
          <a class="dropdown-item" href="entrada.html">Entrada de Produtos</a>
          <a class="dropdown-item" href="movimentacoes.html"
            >Movimentações de Estoque</a
          >
          <a class="dropdown-item" href="solicitacao.html"
            >Solicitações de Pedido</a
          >
        </div>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="usuarios.html">Usuários</a>
      </li>
      <!-- Link Administrativo, visível somente para administradores -->
      <li class="nav-item" id="adminLink" style="display: none;">
        <a class="nav-link" href="admin.html">Administração</a>
      </li>
    </ul>
    <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <a class="nav-link" href="logout.html">Sair</a>
      </li>
    </ul>
  </div>
</nav>
```
