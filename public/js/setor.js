// Importa a configuração do Firebase
import { db } from "./firebase_config.js";

// Função para configurar o formulário de cadastro de setor
function setupCadastroSetor() {
  const form = document.getElementById("formCadastroSetor");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const cod = document.getElementById("setor-cod").value;
    const nome = document.getElementById("setor-nome").value;
    const contrato = document.getElementById("setor-contrato").value;
    try {
      await db.collection("setores").add({ cod, nome, contrato });
      alert("Setor/Cliente cadastrado com sucesso!");
      form.reset();
      carregarSetores();
    } catch (error) {
      console.error("Erro ao cadastrar setor:", error);
    }
  });
}

// Função para carregar e listar os setores
async function carregarSetores() {
  try {
    const snapshot = await db.collection("setores").get();
    const lista = document.getElementById("setor-lista");
    lista.innerHTML = "";
    snapshot.forEach((doc) => {
      const setor = doc.data();
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center";
      li.textContent = `${setor.nome} (Código: ${setor.cod})`;
      const span = document.createElement("span");
      span.innerHTML = `
        <button class="btn btn-sm btn-primary me-2" onclick="editarSetor('${doc.id}', '${setor.cod}', '${setor.nome}', '${setor.contrato}')">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="excluirSetor('${doc.id}')">🗑️</button>
      `;
      li.appendChild(span);
      lista.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao carregar setores:", error);
  }
}

// Funções para edição e exclusão de setores – são adicionadas ao objeto global (window)
window.editarSetor = async function (id, codAtual, nomeAtual, contratoAtual) {
  const novoCod = prompt("Novo código:", codAtual);
  const novoNome = prompt("Novo nome:", nomeAtual);
  const novoContrato = prompt("Novo contrato:", contratoAtual);
  if (novoCod && novoNome) {
    try {
      await db
        .collection("setores")
        .doc(id)
        .update({ cod: novoCod, nome: novoNome, contrato: novoContrato });
      carregarSetores();
    } catch (error) {
      console.error("Erro ao editar setor:", error);
    }
  }
};

window.excluirSetor = async function (id) {
  if (!confirm("Tem certeza que deseja excluir este setor?")) return;
  try {
    await db.collection("setores").doc(id).delete();
    carregarSetores();
  } catch (error) {
    console.error("Erro ao excluir setor:", error);
  }
};

// Inicializa o módulo ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
  setupCadastroSetor();
  carregarSetores();
});
