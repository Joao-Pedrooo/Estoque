import { db } from "../../firebase_config.js";

document.addEventListener("DOMContentLoaded", function () {
  carregarUsuarios();
  carregarSetoresParaUsuario();

  document.getElementById("matricula").addEventListener("change", function () {
    const senhaInput = document.getElementById("senha");
    if (!senhaInput.value) {
      senhaInput.value = this.value;
    }
  });

  document
    .getElementById("formCadastroUsuario")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      salvarUsuario();
    });
});

async function carregarUsuarios() {
  try {
    const snapshot = await db.collection("users").get();
    const tbody = document.getElementById("usuario-lista");
    tbody.innerHTML = "";
    snapshot.forEach((doc) => {
      const user = doc.data();
      tbody.innerHTML += `
                <tr>
                    <td>${doc.id}</td>
                    <td>${user.matricula}</td>
                    <td>${user.nome}</td>
                    <td>${user.setor}</td>
                    <td>${
                      user.is_admin ? "Administrador" : "Usuário Normal"
                    }</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editarUsuario('${
                          doc.id
                        }')">✏️</button>
                        <button class="btn btn-sm btn-danger" onclick="excluirUsuario('${
                          doc.id
                        }')">🗑️</button>
                    </td>
                </tr>
            `;
    });
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
  }
}

async function carregarSetoresParaUsuario() {
  try {
    const snapshot = await db.collection("setores").get();
    const selectSetor = document.getElementById("setor");
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

async function salvarUsuario() {
  const matricula = document.getElementById("matricula").value;
  const nome = document.getElementById("nome").value;
  const setor = document.getElementById("setor").value;
  const senha = document.getElementById("senha").value;
  const isAdmin = matricula === "1234";

  try {
    const id = document.getElementById("user-id").value;
    if (id) {
      await db
        .collection("users")
        .doc(id)
        .update({ matricula, nome, setor, senha, is_admin: isAdmin });
      alert("Usuário atualizado com sucesso!");
    } else {
      await db
        .collection("users")
        .add({ matricula, nome, setor, senha, is_admin: isAdmin });
      alert("Usuário cadastrado com sucesso!");
    }
    document.getElementById("formCadastroUsuario").reset();
    document.getElementById("user-id").value = "";
    carregarUsuarios();
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
  }
}

async function editarUsuario(id) {
  try {
    const doc = await db.collection("users").doc(id).get();
    if (doc.exists) {
      const user = doc.data();
      document.getElementById("user-id").value = id;
      document.getElementById("matricula").value = user.matricula;
      document.getElementById("nome").value = user.nome;
      document.getElementById("setor").value = user.setor;
      document.getElementById("senha").value = user.senha;
    }
  } catch (error) {
    console.error("Erro ao carregar usuário:", error);
  }
}

async function excluirUsuario(id) {
  if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
  try {
    await db.collection("users").doc(id).delete();
    alert("Usuário excluído com sucesso!");
    carregarUsuarios();
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
  }
}
