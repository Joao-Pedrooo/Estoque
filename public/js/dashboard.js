import { db } from "./firebase_config.js";

async function carregarDashboard() {
  try {
    const snapshot = await db.collection("produtos").get();
    let totalProdutos = 0;
    snapshot.forEach((doc) => {
      totalProdutos += doc.data().estoque_atual || 0;
    });
    // Exemplo para usuários e pedidos; ajuste conforme sua implementação
    document.getElementById("total-users").textContent = "10"; // Exemplo fixo
    document.getElementById("total-produtos").textContent = totalProdutos;
    document.getElementById("total-pedidos").textContent = "5"; // Exemplo fixo
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
  }
}

document.addEventListener("DOMContentLoaded", carregarDashboard);
