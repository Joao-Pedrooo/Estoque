// Importa a configuração do Firebase (certifique-se de que o caminho está correto)
import { db } from "./firebase_config.js";

// Função para carregar os setores e preencher o dropdown do produto
async function carregarSetores() {
  try {
    const snapshot = await db.collection("setores").get();
    const selectSetor = document.getElementById("produto-setor");
    selectSetor.innerHTML = "";
    snapshot.forEach((doc) => {
      const setor = doc.data();
      const option = document.createElement("option");
      option.value = setor.nome;
      option.textContent = setor.nome;
      selectSetor.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar setores:", error);
  }
}

// Função para carregar e listar os produtos do Firestore
async function carregarProdutos() {
  try {
    const snapshot = await db.collection("produtos").get();
    const tabela = document.getElementById("produto-lista");
    tabela.innerHTML = "";
    snapshot.forEach((doc) => {
      const produto = doc.data();
      tabela.innerHTML += `
                <tr>
                    <td><img src="${
                      produto.foto || "/static/default.png"
                    }" class="img-fluid" style="max-width: 60px;"></td>
                    <td>${produto.nome}</td>
                    <td>${produto.unidade}</td>
                    <td>${produto.setor || "N/A"}</td>
                    <td>${produto.estoque_atual}</td>
                    <td>${produto.estoque_minimo}</td>
                    <td>${produto.estoque_maximo}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editarProduto('${
                          doc.id
                        }')">✏️</button>
                        <button class="btn btn-sm btn-danger" onclick="excluirProduto('${
                          doc.id
                        }')">🗑️</button>
                    </td>
                </tr>
            `;
    });
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
  }
}

// Configuração do evento de submit do formulário de cadastro de produto
document
  .getElementById("formCadastroProduto")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    // Coleta os dados do formulário
    const nome = document.getElementById("produto-nome").value;
    const unidade = document.getElementById("produto-unidade").value;
    const estoque_minimo = Number(
      document.getElementById("estoque-minimo").value
    );
    const estoque_maximo = Number(
      document.getElementById("estoque-maximo").value
    );
    const setor = document.getElementById("produto-setor").value;

    // Nota: Para upload de imagem, normalmente você usaria Firebase Storage. Aqui usamos um placeholder para a URL.
    const foto = ""; // Placeholder – implemente o upload se necessário

    try {
      await db.collection("produtos").add({
        nome,
        unidade,
        estoque_minimo,
        estoque_maximo,
        setor,
        estoque_atual: 0,
        foto,
      });
      alert("Produto cadastrado com sucesso!");
      document.getElementById("formCadastroProduto").reset();
      carregarProdutos();
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
    }
  });

// Função para editar o produto (exemplo simples)
function editarProduto(id) {
  const novoNome = prompt("Digite o novo nome do produto:");
  if (novoNome) {
    db.collection("produtos")
      .doc(id)
      .update({ nome: novoNome })
      .then(() => carregarProdutos())
      .catch((error) => console.error("Erro ao editar produto:", error));
  }
}

// Função para excluir o produto
function excluirProduto(id) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;
  db.collection("produtos")
    .doc(id)
    .delete()
    .then(() => carregarProdutos())
    .catch((error) => console.error("Erro ao excluir produto:", error));
}

document.addEventListener("DOMContentLoaded", function () {
  carregarSetores();
  carregarProdutos();
});
