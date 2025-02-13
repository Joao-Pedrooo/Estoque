// Função para buscar os dados de estoque do backend e renderizá-los na tabela
async function carregarEstoque() {
  try {
    // Exemplo: realiza uma requisição GET para o endpoint que retorna os dados de estoque
    const response = await fetch("/admin/estoque/");
    if (!response.ok) throw new Error("Erro ao carregar dados do estoque.");

    // Supondo que o backend retorne um array de produtos com os campos: nome, setor, estoque_atual, estoque_minimo, estoque_maximo
    const produtos = await response.json();

    const tbody = document.getElementById("estoque-lista");
    tbody.innerHTML = ""; // Limpa o conteúdo atual

    produtos.forEach((produto) => {
      tbody.innerHTML += `
          <tr>
            <td>${produto.nome}</td>
            <td>${produto.setor}</td>
            <td>${produto.estoque_atual}</td>
            <td>${produto.estoque_minimo}</td>
            <td>${produto.estoque_maximo}</td>
          </tr>
        `;
    });
  } catch (error) {
    console.error("Erro ao carregar estoque:", error);
    const tbody = document.getElementById("estoque-lista");
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Erro ao carregar dados do estoque.</td></tr>`;
  }
}

// Chama a função ao carregar a página
document.addEventListener("DOMContentLoaded", carregarEstoque);
