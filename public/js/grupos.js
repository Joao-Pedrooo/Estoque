import { db } from "../../firebase_config.js";

function setupCadastroGrupo() {
  const form = document.getElementById("form-cadastro-grupo");
  if (!form) return;
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const grupoNome = document.getElementById("grupo-nome").value;
    try {
      await db.collection("grupos").add({ nome: grupoNome });
      alert("Grupo cadastrado com sucesso!");
      form.reset();
      carregarGrupos();
    } catch (error) {
      console.error("Erro ao cadastrar grupo:", error);
    }
  });
}

async function carregarGrupos() {
  try {
    const snapshot = await db.collection("grupos").get();
    const lista = document.getElementById("grupo-lista");
    lista.innerHTML = "";
    snapshot.forEach((doc) => {
      const grupo = doc.data();
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center";
      li.textContent = grupo.nome;
      const span = document.createElement("span");
      span.innerHTML = `
         <button class="btn btn-sm btn-primary me-2" onclick="editarGrupo('${doc.id}', '${grupo.nome}')">✏️</button>
         <button class="btn btn-sm btn-danger" onclick="excluirGrupo('${doc.id}')">🗑️</button>
      `;
      li.appendChild(span);
      lista.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao carregar grupos:", error);
  }
}

function editarGrupo(id, nomeAtual) {
  const novoNome = prompt("Digite o novo nome do grupo:", nomeAtual);
  if (novoNome && novoNome !== nomeAtual) {
    fetch(`/admin/grupos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: novoNome }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao editar grupo.");
        carregarGrupos();
      })
      .catch((error) => console.error("Erro ao editar grupo:", error));
  }
}

function excluirGrupo(id) {
  if (!confirm("Deseja realmente excluir este grupo?")) return;
  fetch(`/admin/grupos/${id}`, { method: "DELETE" })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao excluir grupo.");
      carregarGrupos();
    })
    .catch((error) => console.error("Erro ao excluir grupo:", error));
}

document.addEventListener("DOMContentLoaded", function () {
  setupCadastroGrupo();
  carregarGrupos();
});
