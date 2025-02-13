import { db } from "./firebase_config.js";

let userMatricula = "";
let userSenha = "";
let cart = [];

function showError(message) {
  const errorAlert = document.getElementById("error-alert");
  errorAlert.textContent = message;
  errorAlert.style.display = "block";
  setTimeout(() => (errorAlert.style.display = "none"), 3000);
}

async function carregarSetores() {
  try {
    const snapshot = await db.collection("setores").get();
    const selectSetor = document.getElementById("setor-select");
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

async function carregarItens(setor) {
  try {
    const snapshot = await db
      .collection("produtos")
      .where("setor", "==", setor)
      .get();
    const items = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    renderizarItens(items);
  } catch (error) {
    console.error("Erro ao carregar itens:", error);
  }
}

function renderizarItens(items) {
  const container = document.getElementById("items-container");
  container.innerHTML = items.length
    ? ""
    : "<p class='text-muted text-center'>Nenhum item disponível.</p>";
  items.forEach((item) => {
    const imageUrl = item.foto
      ? `/uploads/${item.foto.split("/").pop()}`
      : "/static/default.png";
    container.innerHTML += `
      <div class="item-card">
        <img src="${imageUrl}" class="item-img" alt="${item.nome}" onerror="this.src='/static/default.png'">
        <div class="flex-grow-1">
          <h5 class="mb-2">${item.nome}</h5>
          <div class="d-flex align-items-center">
            <button class="btn btn-sm btn-danger" onclick="modificarCarrinho(${item.id}, '${item.nome}', -1)">-</button>
            <span id="item-quantidade-${item.id}" class="mx-3">0</span>
            <button class="btn btn-sm btn-success" onclick="modificarCarrinho(${item.id}, '${item.nome}', 1)">+</button>
          </div>
        </div>
      </div>
    `;
  });
}

function modificarCarrinho(id, nome, delta) {
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.quantidade += delta;
    if (item.quantidade <= 0) {
      cart = cart.filter((i) => i.id !== id);
      document.getElementById(`item-quantidade-${id}`).innerText = "0";
    } else {
      document.getElementById(`item-quantidade-${id}`).innerText =
        item.quantidade;
    }
  } else if (delta > 0) {
    cart.push({ id, nome, quantidade: 1 });
    document.getElementById(`item-quantidade-${id}`).innerText = "1";
  }
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const cartContainer = document.getElementById("cart-items");
  cartContainer.innerHTML = "";
  cart.forEach((item) => {
    cartContainer.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${item.nome} - Quantidade: ${item.quantidade}
      </li>
    `;
  });
  document.getElementById("finalize-btn").disabled = cart.length === 0;
}

document
  .getElementById("form-login")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    userMatricula = document.getElementById("matricula").value;
    userSenha = document.getElementById("senha").value;
    await carregarSetores();
    const setorSelect = document.getElementById("setor-select");
    if (setorSelect.options.length > 0) {
      carregarItens(setorSelect.options[0].value);
    }
  });

document
  .getElementById("finalize-btn")
  .addEventListener("click", async function () {
    alert("Pedido finalizado com sucesso!");
  });

document.addEventListener("DOMContentLoaded", function () {
  carregarSetores();
});
