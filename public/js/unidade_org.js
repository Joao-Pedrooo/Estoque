import { db } from "./firebase_config.js";

async function carregarUnidadesOrg() {
  try {
    const snapshot = await db.collection("unidades").get();
    const lista = document.getElementById("unidade-org-list");
    lista.innerHTML = "";
    snapshot.forEach((doc) => {
      const unidade = doc.data();
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center";
      li.textContent = `${unidade.nome} (Cliente: ${unidade.cliente})`;
      const span = document.createElement("span");
      span.innerHTML = `
         <button class="btn btn-sm btn-primary me-2" onclick="editarUnidadeOrg('${doc.id}', '${unidade.nome}', '${unidade.cliente}')">✏️</button>
         <button class="btn btn-sm btn-danger" onclick="excluirUnidadeOrg('${doc.id}')">🗑️</button>
      `;
      li.appendChild(span);
      lista.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao carregar unidades organizacionais:", error);
  }
}

function setupCadastroUnidadeOrg() {
  const form = document.getElementById("formCadastroUnidadeOrg");
  if (!form) return;
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const nome = document.getElementById("unidade-nome").value;
    const cliente = document.getElementById("cliente").value;
    try {
      await db.collection("unidades").add({ nome, cliente });
      alert("Unidade organizacional cadastrada com sucesso!");
      form.reset();
      carregarUnidadesOrg();
    } catch (error) {
      console.error("Erro ao cadastrar unidade organizacional:", error);
    }
  });
}

function editarUnidadeOrg(id, nomeAtual, clienteAtual) {
  const novoNome = prompt("Digite o novo nome da unidade:", nomeAtual);
  const novoCliente = prompt("Digite o novo cliente:", clienteAtual);
  if (
    novoNome &&
    novoCliente &&
    (novoNome !== nomeAtual || novoCliente !== clienteAtual)
  ) {
    fetch(`/admin/unidades/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: novoNome, cliente: novoCliente }),
    })
      .then((response) => {
        if (!response.ok)
          throw new Error("Erro ao editar unidade organizacional.");
        carregarUnidadesOrg();
      })
      .catch((error) =>
        console.error("Erro ao editar unidade organizacional:", error)
      );
  }
}

function excluirUnidadeOrg(id) {
  if (!confirm("Tem certeza que deseja excluir esta unidade organizacional?"))
    return;
  fetch(`/admin/unidades/${id}`, { method: "DELETE" })
    .then((response) => {
      if (!response.ok)
        throw new Error("Erro ao excluir unidade organizacional.");
      carregarUnidadesOrg();
    })
    .catch((error) =>
      console.error("Erro ao excluir unidade organizacional:", error)
    );
}

document.addEventListener("DOMContentLoaded", function () {
  setupCadastroUnidadeOrg();
  carregarUnidadesOrg();
});
